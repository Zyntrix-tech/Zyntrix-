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

require("dotenv").config();

const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("Missing BOT_TOKEN");

const telegram = new TelegramBot(token, { polling: true });

const SESSIONS_DIR = path.join(__dirname, "sessions");
fs.ensureDirSync(SESSIONS_DIR);

const activeSockets = new Map();
const qrMessages = new Map();
const userState = {};

// ===================== COMMAND HANDLER FIX =====================
function attachCommandHandler(sock) {
    if (sock._hasHandler) return; // 🔥 prevents duplicate listeners
    sock._hasHandler = true;

    sock.ev.on("messages.upsert", async (m) => {
        const msg = m?.messages?.[0];
        if (!msg?.message) return;
        if (msg.key?.remoteJid === "status@broadcast") return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        if (!text) return;

        console.log("Received:", text);
    });
}

// ===================== START =====================
telegram.onText(/\/start/, (msg) => {
    telegram.sendMessage(
        msg.chat.id,
        "👋 Tap below to link WhatsApp",
        {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🔗 QR", callback_data: "link_qr" }],
                    [{ text: "📱 Number", callback_data: "link_pair" }]
                ]
            }
        }
    );
});

// ===================== BUTTONS =====================
telegram.on("callback_query", async (q) => {
    const chatId = q.message.chat.id;
    await telegram.answerCallbackQuery(q.id);

    if (q.data === "link_qr") return handleQRLink(chatId);

    if (q.data === "link_pair") {
        userState[chatId] = "WAITING_NUM";
        return telegram.sendMessage(chatId, "Send number: 234XXXXXXXXXX");
    }
});

// ===================== MESSAGE FIX =====================
telegram.on("message", (msg) => {
    if (!msg.text) return;
    if (msg.from?.is_bot) return;

    const chatId = msg.chat.id;

    console.log("STATE:", userState[chatId], "TEXT:", msg.text);

    if (userState[chatId] === "WAITING_NUM") {
        const number = msg.text.replace(/\D/g, "");

        if (!number.startsWith("234")) {
            return telegram.sendMessage(chatId, "❌ Use: 234XXXXXXXXXX");
        }

        if (number.length < 12) {
            return telegram.sendMessage(chatId, "❌ Invalid number");
        }

        delete userState[chatId];

        telegram.sendMessage(chatId, `Processing +${number}...`);

        startWhatsAppSession(chatId, number, true);
    }
});

// ===================== QR =====================
async function handleQRLink(chatId) {
    startWhatsAppSession(chatId, String(chatId), false);
}

// ===================== MAIN SESSION =====================
async function startWhatsAppSession(chatId, id, pairing) {
    const sessionPath = path.join(SESSIONS_DIR, id);

    // 🔥 CLEAN OLD SOCKET
    if (activeSockets.has(id)) {
        const old = activeSockets.get(id);
        try {
            old.ev.removeAllListeners();
            old.ws.close();
            old.end();
        } catch {}
        activeSockets.delete(id);
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        browser: Browsers.ubuntu("Chrome")
    });

    activeSockets.set(id, sock);
    attachCommandHandler(sock);

    // ================= QR =================
    sock.ev.on("connection.update", async (update) => {
        const { connection, qr } = update;

        if (qr && !pairing) {
            const qrImg = await QRCode.toBuffer(qr);

            const sent = await telegram.sendPhoto(chatId, qrImg, {
                caption: "Scan QR"
            });

            qrMessages.set(chatId, sent.message_id);
        }

        if (connection === "open") {
            telegram.sendMessage(chatId, "✅ Connected!");
        }

        if (connection === "close") {
            console.log("Connection closed");
        }
    });

    // ================= PAIRING =================
    if (pairing && !state.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(id);
                telegram.sendMessage(chatId, `CODE: ${code}`);
            } catch {
                telegram.sendMessage(chatId, "Pairing failed");
            }
        }, 5000);
    }

    sock.ev.on("creds.update", saveCreds);
}