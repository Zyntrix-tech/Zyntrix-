const { formatMessage } = require('../fomatter');

function computeSoulmateKey(source, target) {
    const seed = `${source}|${target}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash % 100) + 1;
}

module.exports = {
    name: 'soulmate',
    aliases: ['soul', 'match'],
    description: 'Reveal a fun soulmate score for you and another contact.',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        let target = null;
        const contextInfo = msg.message?.extendedTextMessage?.contextInfo || {};
        if (contextInfo.mentionedJid?.length) {
            target = contextInfo.mentionedJid[0];
        } else if (args.length) {
            const number = args[0].replace(/\D/g, '');
            if (number) target = `${number}@s.whatsapp.net`;
        }

        if (!target) {
            return sock.sendMessage(from, { text: formatMessage('SOULMATE', 'Reply to a user or provide a number to reveal your soulmate score.\nUsage: !soulmate @user') });
        }

        const source = msg.key.participant || msg.key.remoteJid;
        const score = computeSoulmateKey(source, target);
        const lines = [
            `💘 Soulmate score: *${score}%*`,
            '',
            `Your connection is ${score > 80 ? 'cosmic' : score > 50 ? 'promising' : 'mysterious'}!`,
            `Use !timewarp to see when the stars align.`
        ];

        await sock.sendMessage(from, {
            text: formatMessage('SOULMATE', lines.join('\n')),
            mentions: [target]
        });
    }
};