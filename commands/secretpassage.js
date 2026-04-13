const { formatMessage } = require('../fomatter');

function encodeSecret(text) {
    return text.split('').map((char) => `${char}\u200B`).join('');
}

module.exports = {
    name: 'secretpassage',
    aliases: ['secret', 'hiddenpath', 'invisible'],
    description: 'Send a secret passage hidden inside zero-width characters.',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const raw = args.join(' ').trim();
        if (!raw) {
            return sock.sendMessage(from, { text: formatMessage('SECRETPASSAGE', 'Usage: !secretpassage <message>') });
        }

        const encoded = encodeSecret(raw);
        await sock.sendMessage(from, {
            text: formatMessage('SECRETPASSAGE', `Your hidden passage is ready:

${encoded}

Paste this anywhere to keep it invisible.`)
        });
    }
};