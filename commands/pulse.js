const { formatMessage } = require('../fomatter');

function computePulse(chatId) {
    let seed = 0;
    for (const char of String(chatId)) {
        seed += char.charCodeAt(0);
    }
    const value = (seed % 50) + 60;
    return value;
}

module.exports = {
    name: 'pulse',
    aliases: ['heartbeat', 'chatpulse'],
    description: 'Measure the invisible heartbeat of the chat with a uniquely generated pulse reading.',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const pulse = computePulse(from);
        await sock.sendMessage(from, {
            text: formatMessage('PULSE', `💓 Chat heartbeat: *${pulse} bpm*
This is a special pulse value only this bot can calculate.`)
        });
    }
};