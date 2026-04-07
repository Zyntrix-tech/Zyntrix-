const fs = require('fs');
const path = require('path');
const { formatMessage } = require('../fomatter');

const SESSIONS = path.join(__dirname, '..', '..', 'sessions');
const STATE_FILE = path.join(SESSIONS, 'antibadword.json');
if (!fs.existsSync(SESSIONS)) fs.mkdirSync(SESSIONS, { recursive: true });

const badWords = [
    'stupid', 'idiot', 'dumb', 'hate', 'ugly', 'suck', 'fool', 'loser', 'trash', 'bastard'
];

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

function normalizeText(msg) {
    return String(
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        ''
    ).toLowerCase();
}

function detectBadWord(text) {
    const cleaned = text.replace(/[^a-z0-9 ]/gi, ' ');
    const words = cleaned.split(/\s+/).filter(Boolean);
    return badWords.find((word) => words.includes(word));
}

async function ensureListener(sock) {
    if (sock._nexoraAntiBadwordAttached) return;
    sock._nexoraAntiBadwordAttached = true;

    sock.ev.on('messages.upsert', async (m) => {
        try {
            if (m.type !== 'notify') return;
            for (const msg of m.messages) {
                if (!msg.message || msg.key.fromMe || msg.message.protocolMessage) continue;
                const from = msg.key.remoteJid;
                const text = normalizeText(msg);
                if (!text) continue;
                const bad = detectBadWord(text);
                const enabled = state.global === true || state[from] === true;
                if (!enabled || !bad) continue;

                await sock.sendMessage(from, {
                    text: formatMessage('ANTIBADWORD', `🚫 Bad word detected: *${bad}*
Please keep the chat clean. This chat is protected by Antibadword.`)
                });
            }
        } catch (e) {
            console.error('antibadword listener error:', e);
        }
    });
}

module.exports = {
    name: 'antibadword',
    aliases: ['antibadwork'],
    description: 'Enable or disable bad word filtering in the chat.',

    async execute(sock, msg, args = []) {
        await ensureListener(sock);
        const from = msg.key.remoteJid;
        const action = String(args[0] || '').toLowerCase();

        if (!action || action === 'status') {
            const enabled = state.global === true || state[from] === true;
            return sock.sendMessage(from, { text: formatMessage('ANTIBADWORD STATUS', enabled ? '🚫 Antibadword is ENABLED.' : '✅ Antibadword is DISABLED.') });
        }

        if (action === 'on' || action === 'enable') {
            state[from] = true;
            saveState(state);
            return sock.sendMessage(from, { text: formatMessage('ANTIBADWORD', '🚫 Antibadword has been *ENABLED* for this chat.') });
        }

        if (action === 'off' || action === 'disable') {
            state[from] = false;
            saveState(state);
            return sock.sendMessage(from, { text: formatMessage('ANTIBADWORD', '✅ Antibadword has been *DISABLED* for this chat.') });
        }

        if (action === 'global' || action === 'all') {
            state.global = true;
            saveState(state);
            return sock.sendMessage(from, { text: formatMessage('ANTIBADWORD', '🌐 Antibadword has been *ENABLED* globally for all chats.') });
        }

        if (action === 'globaloff' || action === 'alloff') {
            state.global = false;
            saveState(state);
            return sock.sendMessage(from, { text: formatMessage('ANTIBADWORD', '🌐 Global Antibadword has been *DISABLED*.') });
        }

        return sock.sendMessage(from, { text: formatMessage('ANTIBADWORD', 'Usage: !antibadword on | off | global | globaloff | status') });
    }
};