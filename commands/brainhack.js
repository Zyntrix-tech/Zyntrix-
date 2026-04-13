const { formatMessage } = require('../fomatter');

const brainEffects = [
    'Your brain is now seeing the hidden pattern in the chat.',
    'A cascade of thoughts just aligned inside the group.',
    'Neural sparks fired: the bot read your pulse correctly.',
    'Synapses shimmered. The message is already decoded.',
    'The group is now connected on a secret mental channel.'
];

module.exports = {
    name: 'brainhack',
    aliases: ['hackbrain', 'mindhack'],
    description: 'Activate a brainhack sequence with surreal chat feedback.',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const line = brainEffects[Math.floor(Math.random() * brainEffects.length)];
        await sock.sendMessage(from, {
            text: formatMessage('BRAINHACK', `${line}

🧠 *Hack complete.*
This command is unlike any normal WhatsApp bot command.`)
        });
    }
};