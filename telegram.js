const TelegramBot = require('node-telegram-bot-api');
const telegram = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const fs = require('fs-extra');
const path = require('path');
const QRCode = require('qrcode');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');

// -----------------------------
// GLOBALS
// -----------------------------
const SESSIONS_DIR = './sessions';
const activeSockets = new Map(); // chatId -> socket
const qrMessages = new Map(); // chatId -> message_id
const userState = {}; // chatId -> state

// -----------------------------
// TELEGRAM BOT COMMANDS
// -----------------------------
telegram.onText(//start/, (msg) => {
telegram.sendMessage(msg.chat.id,
👋 *SILENT-V1 Bot Manager*\n\nTap below to link your WhatsApp.,
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

telegram.onText(//link/, (msg) => handleQRLink(msg.chat.id));

// -----------------------------
// CALLBACK QUERY HANDLER
// -----------------------------
telegram.on("callback_query", async (q) => {
const chatId = q.message.chat.id;
await telegram.answerCallbackQuery(q.id);

switch (q.data) {  
    case "link_qr":  
        return handleQRLink(chatId);  

    case "link_pair":  
        userState[chatId] = 'WAITING_NUM';  
        return telegram.sendMessage(chatId,   
            "📱 *Send your WhatsApp number*\n\nFormat: `923417407434`\n\n_Send /cancel to stop_",   
            { parse_mode: 'Markdown' }  
        );  

    case "help":  
        return telegram.sendMessage(chatId,   
            `❓ *Help Options:*\n\n` +  
            `1️⃣ Tap "Link WhatsApp (QR)" → Scan QR\n` +  
            `2️⃣ Tap "Link with Phone Number" → Enter your number → Wait for code\n\n` +  
            `After linking, send *.menu* on WhatsApp!`,   
            { parse_mode: 'Markdown' }  
        );  

    case "cancel":  
        delete userState[chatId];  
        if (activeSockets.has(String(chatId))) {  
            const sock = activeSockets.get(String(chatId));  
            try { sock.ev.removeAllListeners(); sock.ws.close(); sock.end(); } catch (_) {}  
            activeSockets.delete(String(chatId));  
        }  
        if (qrMessages.has(chatId)) {  
            telegram.deleteMessage(chatId, qrMessages.get(chatId)).catch(() => {});  
            qrMessages.delete(chatId);  
        }  
        return telegram.sendMessage(chatId, "❌ *Cancelled.*", { parse_mode: 'Markdown' });  
}

});

// -----------------------------
// PHONE NUMBER HANDLER
// -----------------------------
telegram.on('message', (msg) => {
const chatId = msg.chat.id;

if (userState[chatId] === 'WAITING_NUM' && msg.text && !msg.text.startsWith('/')) {  
    const number = msg.text.replace(/[^0-9]/g, '');  
    if (number.length < 10) return telegram.sendMessage(chatId, "🩸 Invalid number. Try again or /cancel.");  

    delete userState[chatId];  

    const sessionPath = path.join(SESSIONS_DIR, number);  
    if (fs.existsSync(sessionPath)) fs.removeSync(sessionPath);  

    telegram.sendMessage(chatId,   
        `🔄 Processing +${number}...\n\n` +  
        `1️⃣ Open WhatsApp\n` +  
        `2️⃣ Linked Devices → Link a Device\n` +  
        `3️⃣ Click *Link with phone number*\n` +  
        `4️⃣ Wait for code...`,   
        { parse_mode: 'Markdown' }  
    );  

    startWhatsAppSession(chatId, number, true);  
}  

// Allow /cancel while waiting for number  
if (msg.text === '/cancel' && userState[chatId]) {  
    delete userState[chatId];  
    telegram.sendMessage(chatId, "❌ *Cancelled.*", { parse_mode: 'Markdown' });  
}

});

// -----------------------------
// QR HANDLER
// -----------------------------
async function handleQRLink(chatId) {
const sessionId = String(chatId);

// Clean previous socket  
if (activeSockets.has(sessionId)) {  
    const sock = activeSockets.get(sessionId);  
    try { sock.ev.removeAllListeners(); sock.ws.close(); sock.end(); } catch (_) {}  
    activeSockets.delete(sessionId);  
}  

// Delete old QR message  
if (qrMessages.has(chatId)) {  
    telegram.deleteMessage(chatId, qrMessages.get(chatId)).catch(() => {});  
    qrMessages.delete(chatId);  
}  

const sessionPath = path.join(SESSIONS_DIR, sessionId);  
if (fs.existsSync(sessionPath)) fs.removeSync(sessionPath);  

await telegram.sendMessage(chatId, "⏳ *Generating QR...*", { parse_mode: 'Markdown' });  
startWhatsAppSession(chatId, sessionId, false);

}

// -----------------------------
// START WHATSAPP SESSION
// -----------------------------
async function startWhatsAppSession(tgChatId, identifier, usePairing) {
const sessionPath = path.join(SESSIONS_DIR, identifier);
console.log(🔌 [INIT] Starting: ${identifier});

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

    activeSockets.set(identifier, sock);  

    // PAIRING WITH PHONE NUMBER  
    if (usePairing && !sock.authState.creds.registered && tgChatId) {  
        setTimeout(async () => {  
            try {  
                const code = await sock.requestPairingCode(identifier);  
                const formatted = code?.match(/.{1,4}/g)?.join('-') || code;  
                telegram.sendMessage(tgChatId, `*YOUR CODE:*\n\`${formatted}\``, { parse_mode: 'Markdown' });  
            } catch {  
                telegram.sendMessage(tgChatId, "🩸 Error. Try /link for QR instead.");  
            }  
        }, 5000);  
    }  

    // QR CODE HANDLING  
    let qrCount = 0;  
    sock.ev.on('connection.update', async (update) => {  
        const { connection, lastDisconnect, qr } = update;  

        if (qr && tgChatId && !usePairing) {  
            qrCount++;  
            if (qrCount > 5) return telegram.sendMessage(tgChatId, "⏰ *QR expired.* /link for new one.", { parse_mode: 'Markdown' });  

            try {  
                const qrBuf = await QRCode.toBuffer(qr, { type: 'png', width: 512, margin: 2 });  
                if (qrMessages.has(tgChatId)) telegram.deleteMessage(tgChatId, qrMessages.get(tgChatId)).catch(() => {});  

                const sent = await telegram.sendPhoto(tgChatId, qrBuf, {   
                    caption: `📱 *Scan QR* — WhatsApp → Linked Devices\n🔄 ${qrCount}/5`,   
                    parse_mode: 'Markdown',  
                    reply_markup: { inline_keyboard: [[{ text: "❌ Cancel", callback_data: "cancel" }]] }  
                });  

                qrMessages.set(tgChatId, sent.message_id);  
            } catch (e) { console.error("QR error:", e.message); }  
        }  

        if (connection === 'close') {  
            const reason = lastDisconnect?.error?.output?.statusCode;  
            console.log(`❌ [${identifier}] Closed: ${reason}`);  
            if (reason !== DisconnectReason.loggedOut && reason !== 401) startWhatsAppSession(tgChatId, identifier, false);  
            else {  
                if (tgChatId) telegram.sendMessage(tgChatId, "⚠️ Logged Out. /link to reconnect.").catch(() => {});  
                fs.removeSync(sessionPath);  
                activeSockets.delete(identifier);  
            }  
        } else if (connection === 'open') {  
            console.log(`✅ [${identifier}] ONLINE!`);  
            if (tgChatId) {  
                if (qrMessages.has(tgChatId)) telegram.deleteMessage(tgChatId, qrMessages.get(tgChatId)).catch(() => {});  
                qrMessages.delete(tgChatId);  
                telegram.sendMessage(tgChatId, "✅ *Connected!*\nSend *.menu* on WhatsApp.", { parse_mode: 'Markdown' });  
            }  
        }  
    });  

    sock.ev.on('creds.update', saveCreds);  
} catch (e) { console.error("Start session error:", e); }

}