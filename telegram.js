// --- At the top, keep your activeSockets and qrMessages maps as-is ---
const activeSockets = new Map();
const qrMessages = new Map();

// --- Modify startWhatsAppSession minimally ---
async function startWhatsAppSession(tgChatId, identifier, usePairing) {
    const sessionPath = path.join(SESSIONS_DIR, identifier);
    console.log(`[INIT] Starting: ${identifier}`);

    // Prevent multiple sessions for same identifier
    if (activeSockets.has(identifier)) {
        const oldSock = activeSockets.get(identifier);
        try { oldSock.ev.removeAllListeners(); oldSock.ws.close(); oldSock.end(); } catch (_) {}
        activeSockets.delete(identifier);
    }

    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        let version;
        try { version = (await fetchLatestBaileysVersion()).version; } 
        catch { version = [2, 3000, 1027934701]; }

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

        // Remove old listeners only for messages
        sock.ev.removeAllListeners("messages.upsert");

        activeSockets.set(identifier, sock);
        attachCommandHandler(sock);

        // Pairing code logic stays untouched
        if (usePairing && !state.creds.registered && tgChatId) {
            setTimeout(async () => {
                try {
                    const code = await sock.requestPairingCode(identifier);
                    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
                    telegram.sendMessage(tgChatId,
                        `*YOUR CODE:*\n\`${formattedCode}\`\n\n_(Tap to copy)_`,
                        { parse_mode: "Markdown" }
                    );
                } catch (e) {
                    console.error("[PAIRING]", e);
                    telegram.sendMessage(tgChatId, "❌  Error. Try /link for QR instead.");
                }
            }, 6000);
        }

        // --- FIX: limit QR spamming ---
        let qrSent = false; // <- only send 1 QR per session

        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr && tgChatId && !usePairing) {
                if (qrSent) return; // stop multiple QR sends
                qrSent = true;

                try {
                    const qrBuf = await QRCode.toBuffer(qr, { type: "png", width: 512, margin: 2 });
                    const prev = qrMessages.get(tgChatId);
                    if (prev) telegram.deleteMessage(tgChatId, prev).catch(() => {});
                    
                    const sent = await telegram.sendPhoto(tgChatId, qrBuf, {
                        caption: `📱 *Scan QR* — WhatsApp → Linked Devices`,
                        parse_mode: "Markdown",
                        reply_markup: { inline_keyboard: [[{ text: "❌ Cancel", callback_data: "cancel" }]] }
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
                    try { sock.ev.removeAllListeners(); sock.ws.close(); sock.end(); } catch (_) {}
                    startWhatsAppSession(tgChatId, identifier, false);
                } else {
                    if (tgChatId) telegram.sendMessage(tgChatId, "⚠️ Logged Out. /link to reconnect.").catch(() => {});
                    fs.removeSync(sessionPath);
                    activeSockets.delete(identifier);
                }
            } else if (connection === "open") {
                console.log(`[${identifier}] ONLINE!`);
            }
        });

    } catch (e) {
        console.error(`[${identifier}] Failed to start session:`, e.message || e);
        if (tgChatId) telegram.sendMessage(tgChatId, "❌ Failed to start WhatsApp session.");
    }
}