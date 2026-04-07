const TelegramBot = require("node-telegram-bot-api");
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const { saveOwner } = require('./ownerStorage');

const SESSIONS_DIR = path.join(__dirname, '..', 'sessions');
const activeSockets = new Map();
const qrMessages = new Map();

// Validate environment before starting
console.log('🔍 Railway Bot Initialization...');
if (!process.env.BOT_TOKEN) {
    console.error('🔴 ERROR: BOT_TOKEN environment variable is not set!');
    console.error('   Add BOT_TOKEN to your Railway environment variables.');
    process.exit(1);
}
console.log('✅ BOT_TOKEN found');

// Initialize bot with error handling
const telegram = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log('✅ Telegram bot initialized');

// Handle polling errors to prevent 409 conflicts
telegram.on('polling_error', (error) => {
    if (error.code === 'ETELEGRAM' && error.message.includes('409')) {
        console.error('🔴 Telegram 409 Conflict: Multiple bot instances detected');
        console.error('Stopping polling to allow other instance to run...');
        telegram.stopPolling();
        setTimeout(() => process.exit(1), 2000);
    } else {
        console.error('Telegram polling error:', error.message);
    }
});

// Graceful shutdown handler
process.on('SIGTERM', async () => {
    console.log('SIGTERM received: Starting graceful shutdown...');
    telegram.stopPolling();
    for (const [id, sock] of activeSockets) {
        try {
            sock.ev?.removeAllListeners?.();
            sock.ws?.close?.();
            sock.end?.();
        } catch (_) {}
    }
    activeSockets.clear();
    setTimeout(() => process.exit(0), 2000);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received: Starting graceful shutdown...');
    telegram.stopPolling();
    for (const [id, sock] of activeSockets) {
        try {
            sock.ev?.removeAllListeners?.();
            sock.ws?.close?.();
            sock.end?.();
        } catch (_) {}
    }
    activeSockets.clear();
    setTimeout(() => process.exit(0), 2000);
});

telegram.onText(/\/start/, (msg) => {
    telegram.sendMessage(msg.chat.id,
        `👋 *Zyntrix Bot Manager*\n\nTap below to link your WhatsApp.`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🔗 Link WhatsApp (QR)", callback_data: "link_qr" }],
                    [{ text: "📱 Link with Phone Number", callback_data: "link_pair" }],
                    [{ text: "❓ Help", callback_data: "help" }],
                ],
            },
        }
    );
});

telegram.onText(/\/link/, (msg) => handleQRLink(msg.chat.id));

const userState = {};

telegram.on("callback_query", async (q) => {
    const c = q.message.chat.id;
    await telegram.answerCallbackQuery(q.id);
    if (q.data === "link_qr") return handleQRLink(c);
    if (q.data === "link_pair") {
        userState[c] = 'WAITING_NUM';
        return telegram.sendMessage(c, "📱 *Send your WhatsApp number*\n\nFormat: `923417407434`", { parse_mode: 'Markdown' });
    }
    if (q.data === "help") {
        return telegram.sendMessage(c, `❓ *Option 1:* Tap "Link WhatsApp (QR)" → Scan\n*Option 2:* Send phone number → Enter code\n\nAfter linking, send *.menu* on WhatsApp!`, { parse_mode: 'Markdown' });
    }
    if (q.data === "cancel") {
        const sessionId = String(c);
        if (activeSockets.has(sessionId)) { const s = activeSockets.get(sessionId); try { s.ev.removeAllListeners(); s.ws.close(); s.end(); } catch (_) {} activeSockets.delete(sessionId); }
        const prev = qrMessages.get(c);
        if (prev) { telegram.deleteMessage(c, prev).catch(() => {}); qrMessages.delete(c); }
        return telegram.sendMessage(c, "❌ *Cancelled.*", { parse_mode: 'Markdown' });
    }
});

telegram.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (userState[chatId] === 'WAITING_NUM' && msg.text && !msg.text.startsWith('/')) {
        const number = msg.text.replace(/[^0-9]/g, '');
        if (number.length < 10) return telegram.sendMessage(chatId, "🩸 Invalid number.");
        delete userState[chatId];
        const sessionPath = path.join(SESSIONS_DIR, number);
        if (fs.existsSync(sessionPath)) fs.removeSync(sessionPath);
        telegram.sendMessage(chatId, `🔄 Processing +${number}...\n\n1. Open WhatsApp\n2. Linked Devices → Link a Device\n3. Click *Link with phone number*\n4. Wait for code...`, { parse_mode: 'Markdown' });
        startWhatsAppSession(chatId, number, true);
    }
});

async function handleQRLink(chatId) {
    const sessionId = String(chatId);
    if (activeSockets.has(sessionId)) { const s = activeSockets.get(sessionId); try { s.ev.removeAllListeners(); s.ws.close(); s.end(); } catch (_) {} activeSockets.delete(sessionId); }
    const prev = qrMessages.get(chatId); if (prev) { telegram.deleteMessage(chatId, prev).catch(() => {}); qrMessages.delete(chatId); }
    const sessionPath = path.join(SESSIONS_DIR, sessionId);
    if (fs.existsSync(sessionPath)) fs.removeSync(sessionPath);
    await telegram.sendMessage(chatId, "⏳ *Generating QR...*", { parse_mode: 'Markdown' });
    startWhatsAppSession(chatId, sessionId, false);
}

// ==============================================================================
// 3. WHATSAPP SESSION CORE
// ==============================================================================
async function startWhatsAppSession(tgChatId, identifier, usePairing) {
    const sessionPath = path.join(SESSIONS_DIR, identifier);
    console.log(`🔌 [INIT] Starting: ${identifier}`);
    
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        let version;
        try { version = (await fetchLatestBaileysVersion()).version; } catch { version = [2, 3000, 1015901307]; }

        const sock = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            markOnlineOnConnect: false,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            connectTimeoutMs: 60000
        });

        global.globalSock = sock;
        activeSockets.set(identifier, sock);

        // ── Track connection time to skip old messages ──
        let botStartTime = null;

        // 🔑 PAIRING CODE
        if (usePairing && !sock.authState.creds.registered && tgChatId) {
            console.log(`⏳ [PAIRING] Waiting 6s...`);
            setTimeout(async () => {
                try {
                    const code = await sock.requestPairingCode(identifier);
                    const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;
                    console.log(`🔑 [PAIRING] Code: ${formattedCode}`);
                    telegram.sendMessage(tgChatId, `*YOUR CODE:*\n\`${formattedCode}\`\n\n_(Tap to copy)_`, { parse_mode: 'Markdown' });
                } catch (e) {
                    console.error(`🩸 [PAIRING]`, e);
                    telegram.sendMessage(tgChatId, "🩸 Error. Try /link for QR instead.");
                }
            }, 6000);
        }

        // 📱 QR CODE
        let qrCount = 0;

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr && tgChatId && !usePairing) {
                qrCount++;
                if (qrCount > 5) { telegram.sendMessage(tgChatId, `⏰ *QR expired.* /link for new one.`, { parse_mode: 'Markdown' }); return; }
                try {
                    const qrBuf = await QRCode.toBuffer(qr, { type: 'png', width: 512, margin: 2 });
                    const prev = qrMessages.get(tgChatId); if (prev) telegram.deleteMessage(tgChatId, prev).catch(() => {});
                    const sent = await telegram.sendPhoto(tgChatId, qrBuf, { caption: `📱 *Scan QR* — WhatsApp → Linked Devices\n🔄 ${qrCount}/5`, parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: "❌ Cancel", callback_data: "cancel" }]] } });
                    qrMessages.set(tgChatId, sent.message_id);
                } catch (e) { console.error("QR err:", e.message); }
            }

            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                console.log(`\n❌ [${identifier}] Connection Closed`);
                console.log(`   Reason Code: ${reason}`);
                if (reason !== DisconnectReason.loggedOut && reason !== 401) {
                    console.log(`   Attempting to reconnect...`);
                    startWhatsAppSession(tgChatId, identifier, false);
                } else {
                    console.log(`   Logged out or invalid session`);
                    if (tgChatId) telegram.sendMessage(tgChatId, "⚠️ Logged Out. /link to reconnect.").catch(() => {});
                    try { fs.removeSync(sessionPath); } catch (e) {}
                    activeSockets.delete(identifier);
                }
            } else if (connection === 'open') {
                console.log(`\n${'='.repeat(50)}`);
                console.log(`✅ [${identifier}] WhatsApp Connected!`);
                console.log(`${'='.repeat(50)}\n`);
                
                // ── Set start time — only process messages AFTER this ──
                botStartTime = Math.floor(Date.now() / 1000);
                
                // ── Auto-add connected user as OWNER ──
                try {
                    const myNumber = sock.user.id.split(':')[0].split('@')[0];
                    saveOwner(myNumber);
                    console.log(`👑 Owner user: ${myNumber}`);
                } catch (e) {
                    console.error('Failed to save owner:', e.message);
                }

                if (tgChatId) {
                    const prev = qrMessages.get(tgChatId); 
                    if (prev) { 
                        telegram.deleteMessage(tgChatId, prev).catch(() => {}); 
                        qrMessages.delete(tgChatId); 
                    }
                    telegram.sendMessage(tgChatId, `✅ *Connected!*\n👑 You are now Owner.\nSend *.menu* on WhatsApp.`, { parse_mode: 'Markdown' }).catch(() => {});
                }
            }
            }
        });

        sock.ev.on('creds.update', saveCreds);

        // Load commands from directory
        const commands = new Map();
        const commandsDir = path.join(__dirname, 'commands');
        
        if (fs.existsSync(commandsDir)) {
            const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
            console.log(`📂 Found ${commandFiles.length} command files in ${commandsDir}`);
            
            for (const file of commandFiles) {
                try {
                    const cmdPath = path.join(commandsDir, file);
                    delete require.cache[require.resolve(cmdPath)];
                    const cmd = require(cmdPath);
                    
                    if (cmd && cmd.name) {
                        const cmdKey = String(cmd.name).toLowerCase();
                        commands.set(cmdKey, cmd);
                        console.log(`  ✅ Loaded: ${cmdKey}`);
                        
                        // Add aliases
                        if (Array.isArray(cmd.aliases)) {
                            for (const alias of cmd.aliases) {
                                commands.set(String(alias).toLowerCase(), cmd);
                            }
                        }
                    } else {
                        console.warn(`  ⚠️  ${file} - No name property found`);
                    }
                } catch (e) {
                    console.error(`  ❌ Error loading ${file}:`, e.message);
                }
            }
        } else {
            console.error('⚠️ Commands directory not found! Creating it...');
            fs.mkdirSync(commandsDir, { recursive: true });
        }

        console.log(`\n✅ Bot Ready! Total commands loaded: ${commands.size}\n`);

        sock.ev.on('messages.upsert', async (m) => {
            try {
                const msg = m.messages[0];
                if (!msg?.message) return;

                // Normalize text from different message types
                const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toString().trim();
                const from = msg.key.remoteJid;
                const sender = msg.key.participant || msg.key.remoteJid;

                // Skip messages before bot start time
                if (botStartTime && msg.messageTimestamp < botStartTime) return;

                // Skip if message is from bot itself
                if (msg.key.fromMe) return;

                // Check if it's a command (starts with prefix)
                const prefix = global.prefix || '.';
                if (!text.startsWith(prefix)) return;

                const args = text.slice(prefix.length).trim().split(/\s+/);
                const commandName = args.shift().toLowerCase();

                console.log(`📨 Command received: ${commandName} | From: ${sender} | Args: ${args.length}`);

                const command = commands.get(commandName);
                if (!command) {
                    console.log(`  ⚠️  Unknown command: ${commandName}`);
                    try {
                        await sock.sendMessage(from, { text: `❌ Unknown command: *${commandName}*\n\nType *.help* for available commands.` });
                    } catch (e) {
                        console.error('Failed to send unknown command message:', e.message);
                    }
                    return;
                }

                try {
                    console.log(`  ⏱️  Executing: ${commandName}`);
                    await command.execute(sock, msg, args);
                    console.log(`  ✅ Command executed: ${commandName}`);
                } catch (cmdError) {
                    console.error(`  ❌ Execution error for ${commandName}:`, cmdError.message);
                    try {
                        await sock.sendMessage(from, { text: `❌ Error executing command: ${commandName}\n\nError: ${cmdError.message || 'Unknown error'}` });
                    } catch (sendErr) {
                        console.error('Failed to send error message:', sendErr.message);
                    }
                }
            } catch (e) {
                console.error('🔴 Fatal error in message handler:', e.message);
            }
        });

    } catch (e) {
        console.error('Error starting WhatsApp session:', e);
        if (tgChatId) {
            telegram.sendMessage(tgChatId, "🩸 Error starting session. Try again.").catch(() => {});
        }
    }
}
