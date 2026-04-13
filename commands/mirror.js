const { formatMessage } = require('../fomatter');

const lastText = new Map();

function extractText(msg) {
    return String(
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        ''
    ).trim();
}

async function ensureListener(sock) {
    if (sock._nexoraMirrorAttached) return;
    sock._nexoraMirrorAttached = true;

    sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;
        for (const msg of m.messages) {
            if (!msg.message || msg.key.fromMe || msg.message.protocolMessage) continue;
            const from = msg.key.remoteJid;
            const text = extractText(msg);
            if (!text) continue;
            if (text.startsWith('!') || text.startsWith('.')) continue;
            lastText.set(from, text);
        }
    });
}

module.exports = {
    name: 'mirror',
    aliases: ['repeat', 'reflect'],
    description: 'Repeat the last non-command message seen in this chat.',

    async execute(sock, msg) {
        await ensureListener(sock);
        const from = msg.key.remoteJid;
        const last = lastText.get(from);
        if (!last) {
            return sock.sendMessage(from, { text: formatMessage('MIRROR', 'No recent message found to mirror. Send something first, then use !mirror.') });
        }

        await sock.sendMessage(from, {
            text: formatMessage('MIRROR', `I see you said:

"${last}"

✨ Mirror magic activated.`)
        });
    }
};