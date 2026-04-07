const fs = require('fs');
const path = require('path');
const { formatMessage } = require('../fomatter');

const SESSIONS = path.join(__dirname, '..', '..', 'sessions');
const STATE_FILE = path.join(SESSIONS, 'antilink.json');
if (!fs.existsSync(SESSIONS)) fs.mkdirSync(SESSIONS, { recursive: true });

function loadState() {
    try {
        return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8') || '{}');
    } catch (e) {
        return { global: false };
    }
}

function saveState(state) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

let state = loadState();
if (state.global === undefined) {
    state.global = false;
    saveState(state);
}

function extractText(msg) {
    return String(
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        ''
    ).trim();
}

function hasLink(text) {
    const urlRegex = /(https?:\/\/|www\.|\.[a-z]{2,})([^\s]+)/i;
    return urlRegex.test(text);
}

async function ensureListener(sock) {
    if (sock._nexoraAntiLinkAttached) return;
    sock._nexoraAntiLinkAttached = true;

    sock.ev.on('messages.upsert', async (m) => {
        try {
            if (m.type !== 'notify') return;
            for (const msg of m.messages) {
                if (!msg.message || msg.key.fromMe || msg.message.protocolMessage) continue;
                const from = msg.key.remoteJid;
                const text = extractText(msg);
                if (!text || !hasLink(text)) continue;

                const enabled = state.global === true || state[from] === true;
                if (!enabled) continue;

                await sock.sendMessage(from, {
                    text: formatMessage('ANTILINK', `🚫 Link detected and blocked.

This group is protected by Antilink.
If you are the admin, use !antilink off to disable.`)
                });
            }
        } catch (e) {
            console.error('antilink listener error:', e);
        }
    });
}

module.exports = {
    name: 'antilink',
    aliases: ['linkblock'],
    description: 'Enable or disable anti-link protection for the chat.',

    async execute(sock, msg, args = []) {
        await ensureListener(sock);
        const from = msg.key.remoteJid;
        const action = String(args[0] || '').toLowerCase();

        if (!action || ['status', 'help'].includes(action)) {
            const enabled = state.global === true || state[from] === true;
            const message = enabled
                ? '🚫 Antilink is currently *ENABLED* for this chat.'
                : '✅ Antilink is currently *DISABLED* for this chat.';
            return sock.sendMessage(from, { text: formatMessage('ANTILINK STATUS', message) });
        }

        if (action === 'on' || action === 'enable') {
            state[from] = true;
            saveState(state);
            return sock.sendMessage(from, { text: formatMessage('ANTILINK', '🚫 Antilink has been *ENABLED* for this chat. All future links will be blocked.') });
        }

        if (action === 'off' || action === 'disable') {
            state[from] = false;
            saveState(state);
            return sock.sendMessage(from, { text: formatMessage('ANTILINK', '✅ Antilink has been *DISABLED* for this chat.') });
        }

        if (action === 'global' || action === 'all') {
            state.global = true;
            saveState(state);
            return sock.sendMessage(from, { text: formatMessage('ANTILINK', '🌐 Antilink has been *ENABLED* globally for all chats.') });
        }

        if (action === 'globaloff' || action === 'alloff') {
            state.global = false;
            saveState(state);
            return sock.sendMessage(from, { text: formatMessage('ANTILINK', '🌐 Global Antilink has been *DISABLED*. Only individual chats with antlink on will still block links.') });
        }

        return sock.sendMessage(from, {
            text: formatMessage('ANTILINK', 'Usage: !antilink on | off | global | globaloff | status')
        });
    }
};