const { formatMessage } = require('../fomatter');

const quantumPhrases = [
    'You exist in two states: typing and not typing.',
    'If you read this, the wave function collapses into a smile.',
    'Your message is both sent and unsent until the notification arrives.',
    'A qubit just winked at your chat and created a new secret path.',
    'The universe just measured your mood and found curiosity.'
];

module.exports = {
    name: 'quantum',
    aliases: ['qbit', 'quantumjump', 'quantumverse'],
    description: 'Deliver a quantum-style message that feels like a bot from another dimension.',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const phrase = quantumPhrases[Math.floor(Math.random() * quantumPhrases.length)];
        await sock.sendMessage(from, {
            text: formatMessage('QUANTUM', `${phrase}

⚛️ Welcome to the bot that thinks beyond every normal WhatsApp bot.`)
        });
    }
};