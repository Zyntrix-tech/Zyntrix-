const { formatMessage } = require('../fomatter');

const thoughts = [
    'You are thinking about a friend right now.',
    'Somewhere in this chat, a secret is waiting to be revealed.',
    'Your next reply will surprise the group.',
    'A hidden emoji is about to appear in the next message.',
    'Your chat energy is set to *mystery mode*.'
];

module.exports = {
    name: 'telepathy',
    aliases: ['mindread', 'psychic'],
    description: 'Simulate telepathy by guessing the next thought in the chat.',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const line = thoughts[Math.floor(Math.random() * thoughts.length)];
        await sock.sendMessage(from, {
            text: formatMessage('TELEPATHY', `${line}

🔮 This command feels like no ordinary WhatsApp bot at all.`)
        });
    }
};