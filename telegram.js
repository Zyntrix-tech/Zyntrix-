console.log("Telegram Bot started..");   
const TelegramBot = require("node-telegram-bot-api");  
const {  
    default: makeWASocket,  
    useMultiFileAuthState,  
    fetchLatestBaileysVersion,  
    DisconnectReason,  
    Browsers  
} = require("@whiskeysockets/baileys");  
const fs = require("fs-extra");  
const path = require("path");  
const QRCode = require("qrcode");  
  
try {  
    require("dotenv").config({ path: path.join(__dirname, ".env") });  
} catch (_) {}  
  
// Fallback: parse backend/bots/.env even if dotenv is missing/broken.  
if (!process.env.BOT_TOKEN && !process.env.TELEGRAM_BOT_TOKEN) {  
    try {  
        const envPath = path.join(__dirname, ".env");  
        if (fs.existsSync(envPath)) {  
            const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);  
            for (const line of lines) {  
                const trimmed = line.trim();  
                if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;  
                const idx = trimmed.indexOf("=");  
                const key = trimmed.slice(0, idx).trim();  
                const val = trimmed.slice(idx + 1).trim();  
                if (key && process.env[key] == null) process.env[key] = val;  
            }  
        }  
    } catch (e) {  
        console.error("Failed to load .env fallback:", e);  
    }  
}  
  
const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;  
if (!token) {  
    throw new Error("Missing BOT_TOKEN or TELEGRAM_BOT_TOKEN in backend/bots/.env");  
}  
  
const telegram = new TelegramBot(token, { polling: true });  
const SESSIONS_DIR = path.join(__dirname, "sessions");  
fs.ensureDirSync(SESSIONS_DIR);  
  
const activeSockets = new Map();  
const qrMessages = new Map();  
const userState = {};  
const commands = new Map();  
global.chatModes = global.chatModes || {};  
global.botStartTime = global.botStartTime || Date.now();  
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbCFEZv60eBdlqXqQz20";  
const CHANNEL_CODE = "0029VbCFEZv60eBdlqXqQz20";  
  
// Load user prefix helper functions  
let userPrefixHelpers = { getUserPrefix: () => null };  
try {  
    const prefixCmd = require("./commands/prefix.js");  
    if (prefixCmd.getUserPrefix) {  
        userPrefixHelpers = prefixCmd;  
    }  
} catch (e) {  
    console.log("User prefix system not loaded yet");  
}  
  
// Reload prefix module when commands are reloaded  
function loadUserPrefixHelpers() {  
    try {  
        delete require.cache[require.resolve("./commands/prefix.js")];  
        const prefixCmd = require("./commands/prefix.js");  
        if (prefixCmd.getUserPrefix) {  
            userPrefixHelpers = prefixCmd;  
        }  
    } catch (e) {  
        console.error("Error reloading prefix helpers:", e);  
    }  
}  
  
telegram.on("polling_error", console.log);  
  
function resolveCommandsPath() {  
    const pathsToTry = [  
        path.join(__dirname, "commands"),  
        path.join(__dirname, "..", "commands"),  
        path.join(__dirname, "..", "..", "commands"),  
        path.join(process.cwd(), "backend", "bots", "commands"),  
        path.join(process.cwd(), "commands")  
    ];  
    for (const tryPath of pathsToTry) {  
        if (fs.existsSync(tryPath)) {  
            console.log("Found commands directory:", tryPath);  
            return tryPath;  
        }  
    }  
    console.error("Commands directory not found in any of these locations:", pathsToTry);  
    return null;  
}  
  
function loadCommands() {  
    commands.clear();  
    let commandsPath = resolveCommandsPath();  
    let filesToLoad = [];  
      
    if (!commandsPath) {  
        console.log("Commands folder not found. Searching for scattered command files...");  
        const searchPaths = [  
            __dirname,  
            path.join(__dirname, ".."),  
            path.join(__dirname, "..", ".."),  
            process.cwd(),  
            path.join(process.cwd(), "backend", "bots")  
        ];  
          
        for (const searchPath of searchPaths) {  
            try {  
                if (fs.existsSync(searchPath)) {  
                    const found = fs.readdirSync(searchPath).filter((f) => f.endsWith(".js") && f !== "telegram.js" && f !== "index.js" && f !== "bot.js");  
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
        filesToLoad = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js")).map(f => ({ name: f, path: path.join(commandsPath, f) }));  
    }  
      
    console.log("Loading commands from:", commandsPath || "scattered locations", "-", filesToLoad.length, "files found");  
    const loadedPrimaryNames = new Set();  
    const loadedFiles = [];  
  
    for (const file of filesToLoad) {  
        const fileName = file.name;  
        const filePath = file.path;  
        const fileBase = fileName.replace(/\.js$/i, "").toLowerCase();  
        try {  
            delete require.cache[require.resolve(filePath)];  
            const cmd = require(filePath);  
            if (!cmd?.name || typeof cmd.execute !== "function") continue;  
            const primary = String(cmd.name).toLowerCase();  
            commands.set(primary, cmd);  
            loadedPrimaryNames.add(primary);  
            loadedFiles.push(fileBase);  
            console.log("Loaded command:", primary);  
  
            if (!commands.has(fileBase)) commands.set(fileBase, cmd);  
            if (Array.isArray(cmd.aliases)) {  
                for (const alias of cmd.aliases) {  
                    if (alias) commands.set(String(alias).toLowerCase(), cmd);  
                }  
            }  
        } catch (e) {  
            console.error("Failed to load command", fileName, e?.message || e);  
        }  
    }  
  
    console.log("Total commands loaded:", commands.size);  
  
    if (!commands.has("help")) {  
        const helpCmd = {  
            name: "help",  
            async execute(sock, msg) {  
                const from = msg.key.remoteJid;  
                const names = Array.from(new Set([...loadedPrimaryNames, ...loadedFiles]))  
                    .sort((a, b) => a.localeCompare(b));  
                const rows = names.map((n) => `!${n}`).join(", ");  
                await sock.sendMessage(from, {  
                    text: rows ? `Available commands:\n${rows}` : "No commands loaded."  
                }, { quoted: msg });  
            }  
        };  
        commands.set("help", helpCmd);  
    }  
      
    loadUserPrefixHelpers();  
}  
  
function attachCommandHandler(sock) {  
    sock.ev.on("messages.upsert", async (m) => {  
        const msg = m?.messages?.[0];  
        if (!msg?.message) return;  
        if (msg.key?.remoteJid === "status@broadcast") return;  
  
        // Handle fake typing/recording for incoming messages (not from bot)  
        if (!msg.key.fromMe) {  
            // Check if fake typing is enabled  
            if (global.fakeTypingSettings?.enabled) {  
                try {  
                    const from = msg.key.remoteJid;  
                    await sock.sendPresenceUpdate('composing', from);  
                    setTimeout(async () => {  
                        try {  
                            await sock.sendPresenceUpdate('paused', from);  
                        } catch (e) {}  
                    }, 2000 + Math.random() * 2000);  
                } catch (e) {}  
            }  
            // Check if fake recording is enabled  
            if (global.fakeRecordingSettings?.enabled) {  
                try {  
                    const from = msg.key.remoteJid;  
                    await sock.sendPresenceUpdate('recording', from);  
                    setTimeout(async () => {  
                        try {  
                            await sock.sendPresenceUpdate('paused', from);  
                        } catch (e) {}  
                    }, 3000 + Math.random() * 2000);  
                } catch (e) {}  
            }  
        }  
  
        const text = (  
            msg.message.conversation ||  
            msg.message.extendedTextMessage?.text ||  
            msg.message.imageMessage?.caption ||  
            msg.message.videoMessage?.caption ||  
            ""  
        ).toString().trim();  
        if (!text) return;  
  
        let isPrefixCommand = text.startsWith("!") || text.startsWith(".");  
          
        // Check for user-specific prefix  
        const sender = msg.key.participant || msg.key.remoteJid;  
        const userPrefix = userPrefixHelpers.getUserPrefix?.(sender);  
        const hasUserPrefix = userPrefix && text.startsWith(userPrefix);  
          
        // It's a command if it has default prefix OR user-specific prefix  
        isPrefixCommand = isPrefixCommand || hasUserPrefix;  
          
        // Check for prefix-less commands  
        if (!isPrefixCommand) {  
            const parts = text.toLowerCase().split(/\s+/);  
            const cmdName = parts[0];  
            const args = parts.slice(1);  
            const cmd = commands.get(cmdName);  
            if (cmd) {  
                // Check private mode for prefix-less commands  
                const currentMode = global.botMode || global.chatModes?.[msg.key.remoteJid] || "public";  
                const ownerJid = global.ownerJid;  
                const messageSender = msg.key.participant || msg.key.remoteJid;  
                const isOwner = ownerJid && messageSender && (String(messageSender).split('@')[0] === String(ownerJid).split('@')[0]);  
                  
                if (currentMode === "private" && !isOwner && cmd.name !== "menu" && cmd.name !== "help") {  
                    return; // Ignore non-owner commands in private mode  
                }  
                  
                // Execute prefix-less command  
                try {  
                    // Use original sock without any modifications  
                    if (cmd.execute.length >= 2) await cmd.execute(sock, msg, args);  
                    else await cmd.execute(sock, msg);  
                    return;  
                } catch (err) {  
                    console.error(`Error executing prefix-less command '${cmdName}':`, err?.message || err);  
                }  
            }  
            // No valid prefix-less command found, return  
            return;  
        }  
  
        // Process commands with prefix (! or . or user-specific)  
        let prefixUsed = "!";  
        if (text.startsWith(userPrefix)) {  
            prefixUsed = userPrefix;  
        } else if (text.startsWith(".")) {  
            prefixUsed = ".";  
        }  
        const without = text.slice(prefixUsed.length).trim();  
        if (!without) return;  
        const parts = without.split(/\s+/);  
        let typed = (parts[0] || "").toLowerCase();  
        // Remove special characters from command name  
        typed = typed.replace(/[^a-z0-9]/g, '');  
          
        const typoAlias = {  
            ticktock: "tiktok"  
        };  
        const cmdName = typoAlias[typed] || typed;  
        const args = parts.slice(1);  
        const cmd = commands.get(cmdName);  
          
        if (!cmd) {  
            // Silent - don't respond to unknown commands  
            console.log(`Unknown command '${typed}' from ${msg.key.participant || msg.key.remoteJid} - ignoring silently`);  
            return;  
        }  
  
        // Check if bot is in private mode - only owner can use commands  
        const currentMode = global.botMode || global.chatModes?.[msg.key.remoteJid] || "public";  
        const ownerJid = global.ownerJid;  
        const messageSender = msg.key.participant || msg.key.remoteJid;  
        const isOwner = ownerJid && messageSender && (String(messageSender).split('@')[0] === String(ownerJid).split('@')[0]);  
          
        if (currentMode === "private" && !isOwner && cmd.name !== "menu" && cmd.name !== "help") {  
            // Allow menu/help in private mode but ignore other commands from non-owners  
            return;  
        }  
  
        try {  
            // Use original sock without any proxy modifications  
            if (cmd.execute.length >= 2) await cmd.execute(sock, msg, args);  
            else await cmd.execute(sock, msg);  
        } catch (err) {  
            console.error(`Error executing command '${cmdName}':`, err?.message || err);  
            // Silent - don't send error messages after deployment  
            // Only log errors internally  
        }  
    });  
}  
  
loadCommands();  
  
telegram.onText(/\/start/, (msg) => {  
    telegram.sendMessage(  
        msg.chat.id,  
        "👋 *⟦ 𓆩𖤍 NΞXØRΛ 𖤍𓆪 ⟧ ⚡Bot Manager*\n\nTap below to link your WhatsApp.",  
        {  
            parse_mode: "Markdown",  
            reply_markup: {  
                inline_keyboard: [  
                    [{ text: "🔗 Link WhatsApp (QR)", callback_data: "link_qr" }],  
                    [{ text: "📱 Link with Phone Number", callback_data: "link_pair" }],  
                    [{ text: "❓ Help", callback_data: "help" }]  
                ]  
            }  
        }  
    );  
});  
  
telegram.onText(/\/link/, (msg) => handleQRLink(msg.chat.id));  
  
telegram.on("callback_query", async (q) => {  
    const c = q.message.chat.id;  
    await telegram.answerCallbackQuery(q.id);  
  
    if (q.data === "link_qr") return handleQRLink(c);  
  
    if (q.data === "link_pair") {  
        userState[c] = "WAITING_NUM";  
        return telegram.sendMessage(  
            c,  
            "📱 Send your WhatsApp number\n\nFormat: 234..........(Your country code)",  
            { parse_mode: "Markdown" }  
        );  
    }  
  
    if (q.data === "help") {  
        return telegram.sendMessage(  
            c,  
            "❓ *Option 1:* Tap \"Link WhatsApp (QR)\" → Scan\n*Option 2:* Send phone number → Enter code\n\nAfter linking, send *!help* on WhatsApp!",  
            { parse_mode: "Markdown" }  
        );  
    }  
  
    if (q.data === "cancel") {  
        const sessionId = String(c);  
        if (activeSockets.has(sessionId)) {  
            const s = activeSockets.get(sessionId);  
            try { s.ev.removeAllListeners(); s.ws.close(); s.end(); } catch (_) {}  
            activeSockets.delete(sessionId);  
        }  
        const prev = qrMessages.get(c);  
        if (prev) {  
            telegram.deleteMessage(c, prev).catch(() => {});  
            qrMessages.delete(c);  
        }  
        return telegram.sendMessage(c, "❌ Cancelled.", { parse_mode: "Markdown" });  
    }  
});  
  
telegram.on("message", (msg) => {  
    const chatId = msg.chat.id;  
    if (userState[chatId] === "WAITING_NUM" && msg.text && !msg.text.startsWith("/")) {  
        const number = msg.text.replace(/[^0-9]/g, "");  
        if (number.length < 10) return telegram.sendMessage(chatId, "❌  Invalid number.");  
  
        delete userState[chatId];  
        const sessionPath = path.join(SESSIONS_DIR, number);  
        if (fs.existsSync(sessionPath)) fs.removeSync(sessionPath);  
  
        telegram.sendMessage(  
            chatId,  
            `🔄 Processing +${number}...\n\n1. Open WhatsApp\n2. Linked Devices → Link a Device\n3. Click *Link with phone number*\n4. Wait for code...`,  
            { parse_mode: "Markdown" }  
        );  
  
        startWhatsAppSession(chatId, number, true);  
    }  
});  
  
async function handleQRLink(chatId) {  
    const sessionId = String(chatId);  
  
    if (activeSockets.has(sessionId)) {  
        const s = activeSockets.get(sessionId);  
        try { s.ev.removeAllListeners(); s.ws.close(); s.end(); } catch (_) {}  
        activeSockets.delete(sessionId);  
    }  
  
    const prev = qrMessages.get(chatId);  
    if (prev) {  
        telegram.deleteMessage(chatId, prev).catch(() => {});  
        qrMessages.delete(chatId);  
    }  
  
    const sessionPath = path.join(SESSIONS_DIR, sessionId);  
    if (fs.existsSync(sessionPath)) fs.removeSync(sessionPath);  
  
    await telegram.sendMessage(chatId, "⏳ Generating QR...", { parse_mode: "Markdown" });  
    startWhatsAppSession(chatId, sessionId, false);  
}  
  
async function startWhatsAppSession(tgChatId, identifier, usePairing) {  
    const sessionPath = path.join(SESSIONS_DIR, identifier);  
    console.log(`[INIT] Starting: ${identifier}`);  
  
    try {  
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);  
        let version;  
        try {  
            version = (await fetchLatestBaileysVersion()).version;  
        } catch {  
            version = [2, 3000, 1027934701];  
        }  
  
        const sock = makeWASocket({  
            version,  
            printQRInTerminal: false,  
            auth: state,  
            browser: Browsers.ubuntu("Chrome"),  
            markOnlineOnConnect: false,  
            generateHighQualityLinkPreview: true,  
            syncFullHistory: false,  
            connectTimeoutMs: 60000  
        });  
  
        // Remove any existing event listeners to prevent duplicate responses  
        sock.ev.removeAllListeners("messages.upsert");  
          
        activeSockets.set(identifier, sock);  
        attachCommandHandler(sock);  
  
        if (usePairing && !state.creds.registered && tgChatId) {  
            console.log("[PAIRING] Waiting 6s...");  
            setTimeout(async () => {  
                try {  
                    const code = await sock.requestPairingCode(identifier);  
                    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  
                    console.log(`[PAIRING] Code: ${formattedCode}`);  
                    telegram.sendMessage(  
                        tgChatId,  
                        `*YOUR CODE:*\n\`${formattedCode}\`\n\n_(Tap to copy)_`,  
                        {  
                            parse_mode: "Markdown",  
                            reply_markup: {  
                                inline_keyboard: [[{ text: "Copy Code", copy_text: { text: String(code) } }]]  
                            }  
                        }  
                    );  
                } catch (e) {  
                    console.error("[PAIRING]", e);  
                    telegram.sendMessage(tgChatId, "❌  Error. Try /link for QR instead.");  
                }  
            }, 6000);  
        }  
  
        let qrCount = 0;  
  
        sock.ev.on("connection.update", async (update) => {  
            const { connection, lastDisconnect, qr } = update;  
  
            if (qr && tgChatId && !usePairing) {  
                qrCount++;  
                if (qrCount > 5) {  
                    telegram.sendMessage(tgChatId, "⏰ *QR expired.* /link for new one.", { parse_mode: "Markdown" });  
                    return;  
                }  
  
                try {  
                    const qrBuf = await QRCode.toBuffer(qr, { type: "png", width: 512, margin: 2 });  
                    const prev = qrMessages.get(tgChatId);  
                    if (prev) telegram.deleteMessage(tgChatId, prev).catch(() => {});  
  
                    const sent = await telegram.sendPhoto(tgChatId, qrBuf, {  
                        caption: `📱 *Scan QR* — WhatsApp → Linked Devices\n🔄 ${qrCount}/5`,  
                        parse_mode: "Markdown",  
                    reply_markup: {  
                        inline_keyboard: [[{ text: "❌ Cancel", callback_data: "cancel" }]]  
                    }  
                });  
                qrMessages.set(tgChatId, sent.message_id);  
            } catch (e) {  
                console.error("QR err:", e.message);  
            }  
        }  

        if (connection === "close") {  
            const reason = lastDisconnect?.error?.output?.statusCode;  
            console.log(`[${identifier}] Closed: ${reason}`);  

            if (reason !== DisconnectReason.loggedOut && reason !== 401) {  
                // Clean up old socket before creating new one  
                try {  
                    sock.ev.removeAllListeners();  
                    sock.ws.close();  
                    sock.end();  
                } catch (_) {}  
                startWhatsAppSession(tgChatId, identifier, false);  
            } else {  
                if (tgChatId) telegram.sendMessage(tgChatId, "⚠️ Logged Out. /link to reconnect.").catch(() => {});  
                fs.removeSync(sessionPath);  
                activeSockets.delete(identifier);  
            }  
        } else if (connection === "open") {  
            console.log(`[${identifier}] ONLINE!`);  
            try {  
                const me = (sock.user?.id || "").split(":")[0];  
                const myJid = `${me}@s.whatsapp.net`;  
                  
                // Auto-set owner on first connection  
                if (!global.ownerJid) {  
                    global.ownerJid = myJid;  
                    console.log(`[OWNER] Auto-set owner: ${myJid}`);  
                    // Send welcome message to new owner  
                    await sock.sendMessage(myJid, {  
                        text: `👋 *Welcome to Nexora!*

You've been set as the Bot Owner!

You can now:
• Use all commands
• Set other owners with !setowner
• Change bot mode with !mode public/private
• Access admin features

Type !menu to see all commands!

🤖 Powered by ⟦ 𓆩𖤍 NΞXØRΛ 𖤍𓆪 ⟧`
});
}

const ownerJid = global.ownerJid || myJid;  
                if (global.ownerJid) {  
                    await sock.sendMessage(ownerJid, {  
                        image: { url: "https://i.postimg.cc/fbWLNHDB/file-00000000ac7871f58f708c173e99735d.png" },  
                        caption: `🤖 Nexora ⚡IS NOW ONLINE

✅ System Status: Stable
⚡ Response Speed: Ultra Fast
🛡️ Security: Active

📢 STAY UPDATED:
Join our official channels for updates, giveaways, and support!

👥 Official Group:
https://chat.whatsapp.com/Kl9gkhLwNbA0MNWXorgE53?mode=gi_t

📰 Official Channel:
https://whatsapp.com/channel/0029VbCFEZv60eBdlqXqQz20

Power up your WhatsApp experience! 🚀` });
}
} catch (e) {
console.error("Owner DM notify failed:", e?.message || e);
}

if (tgChatId) {  
                const prev = qrMessages.get(tgChatId);  
                if (prev) {  
                    telegram.deleteMessage(tgChatId, prev).catch(() => {});  
                    qrMessages.delete(tgChatId);  
                }  

                telegram.sendMessage(  
                    tgChatId,  
                    "✅ *Connected!*\nSend *!help* on WhatsApp.",  
                    { parse_mode: "Markdown" }  
                ).catch(() => {});  
            }  
        }  
    });  

    sock.ev.on("creds.update", saveCreds);  
} catch (err) {  
    console.error("[INIT ERROR]", err);  
    if (tgChatId) telegram.sendMessage(tgChatId, "❌  Failed to start session. Try again.").catch(() => {});  
}

}