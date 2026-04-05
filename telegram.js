const TelegramBot = require("node-telegram-bot-api");
const telegram = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const { saveOwner } = require('./ownerStorage');

const SESSIONS_DIR = path.join(__dirname, '..', 'sessions');
const activeSockets = new Map();
const qrMessages = new Map();

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
                console.log(`❌ [${identifier}] Closed: ${reason}`);
                if (reason !== DisconnectReason.loggedOut && reason !== 401) {
                    startWhatsAppSession(tgChatId, identifier, false);
                } else {
                    if (tgChatId) telegram.sendMessage(tgChatId, "⚠️ Logged Out. /link to reconnect.").catch(() => {});
                    fs.removeSync(sessionPath);
                    activeSockets.delete(identifier);
                }
            } else if (connection === 'open') {
                console.log(`✅ [${identifier}] ONLINE!`);
                
                // ── Set start time — only process messages AFTER this ──
                botStartTime = Math.floor(Date.now() / 1000);
                
                // ── Auto-add connected user as OWNER ──
                const myNumber = sock.user.id.split(':')[0].split('@')[0];
                saveOwner(myNumber);
                console.log(`👑 [OWNER] Connected user: ${myNumber}`);

                if (tgChatId) {
                    const prev = qrMessages.get(tgChatId); if (prev) { telegram.deleteMessage(tgChatId, prev).catch(() => {}); qrMessages.delete(tgChatId); }
                    telegram.sendMessage(tgChatId, `✅ *Connected!*\n👑 You are now Owner.\nSend *.menu* on WhatsApp.`, { parse_mode: 'Markdown' }).catch(() => {});
                }
            }
        });

        sock.ev.on('creds.update', saveCreds);

        // Load commands
        const commands = new Map();
        
        function resolveCommandsPath() {
            const pathsToTry = [
                path.join(__dirname, 'commands'),
                path.join(__dirname, '..', 'commands'),
                path.join(__dirname, '..', '..', 'commands'),
                path.join(process.cwd(), 'backend', 'bots', 'commands'),
                path.join(process.cwd(), 'commands')
            ];
            for (const tryPath of pathsToTry) {
                if (fs.existsSync(tryPath)) {
                    console.log('Found commands directory:', tryPath);
                    return tryPath;
                }
            }
            console.error('Commands directory not found in any of these locations:', pathsToTry);
            return null;
        }
        
        try {
            let commandsPath = resolveCommandsPath();
            let filesToLoad = [];
            
            if (!commandsPath) {
                // Fallback: search for command files in parent directories
                console.log("Commands folder not found. Searching for scattered command files...");
                const searchPaths = [
                    __dirname,
                    path.join(__dirname, '..'),
                    path.join(__dirname, '..', '..'),
                    process.cwd(),
                    path.join(process.cwd(), 'backend', 'bots')
                ];
                
                for (const searchPath of searchPaths) {
                    try {
                        if (fs.existsSync(searchPath)) {
                            const found = fs.readdirSync(searchPath).filter((f) => f.endsWith('.js') && f !== 'Webnest.js' && f !== 'index.js' && f !== 'bot.js' && f !== 'telegram.js');
                            if (found.length > 0) {
                                console.log(`Found ${found.length} command files in:`, searchPath);
                                filesToLoad = found.map(f => ({ name: f, path: path.join(searchPath, f) }));
                                commandsPath = searchPath;
                                break;
                            }
                        }
                    } catch (e) {
                        // Skip if can't read directory
                    }
                }
            }
            
            if (!commandsPath) {
                console.error('No commands found in any location');
                filesToLoad = [];
            } else {
                filesToLoad = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js')).map(f => ({ name: f, path: path.join(commandsPath, f) }));
            }
            
            console.log('Found command files:', filesToLoad.length);
            for (const file of filesToLoad) {
                try {
                    const cmdPath = file.path;
                    delete require.cache[require.resolve(cmdPath)]; // Clear cache to avoid stale modules
                    const cmd = require(cmdPath);
                    if (cmd && cmd.name) {
                        const cmdKey = String(cmd.name).toLowerCase();
                        commands.set(cmdKey, cmd);
                        console.log('Loaded command:', cmdKey);
                        if (Array.isArray(cmd.aliases)) {
                            for (const alias of cmd.aliases) {
                                if (alias) commands.set(String(alias).toLowerCase(), cmd);
                            }
                        }
                    }
                } catch (e) {
                    console.error('Failed to load command', file.name, e.message);
                }
            }
        } catch (e) {
            console.error('Error loading commands', e);
        }
        console.log('Total commands loaded:', commands.size);

        sock.ev.on('messages.upsert', async (m) => {
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

            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(sock, msg, args);
            } catch (e) {
                console.error('Command execution error:', e);
                try {
                    await sock.sendMessage(from, { text: '❌ Error executing command.' });
                } catch (sendErr) {
                    console.error('Failed to send error message:', sendErr);
                }
            }
        });

    } catch (e) {
        console.error('Error starting WhatsApp session:', e);
        if (tgChatId) {
            telegram.sendMessage(tgChatId, "🩸 Error starting session. Try again.").catch(() => {});
        }
    }
}
