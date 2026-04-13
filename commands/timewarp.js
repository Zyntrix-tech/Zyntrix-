const { formatMessage } = require('../fomatter');

function pad(num) {
    return String(num).padStart(2, '0');
}

function formatTime(date) {
    return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}

module.exports = {
    name: 'timewarp',
    aliases: ['tw', 'timeshift'],
    description: 'Warp time across planets and dimensions with a single command.',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const now = new Date();
        const earth = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const mars = `${pad((now.getHours() + 1) % 24)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const jupiter = `${pad((now.getHours() + 12) % 24)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const quantum = `${pad((now.getHours() + 7) % 24)}:${pad((now.getMinutes() + 13) % 60)}:${pad((now.getSeconds() + 19) % 60)}`;
        const body = `*TIMEWARP*

⏳ Earth Time   : ${earth}
🪐 Mars Time    : ${mars}
🌌 Jupiter Time : ${jupiter}
⚛️ Quantum Time : ${quantum}

*Reality is a moving target.*`;
        await sock.sendMessage(from, { text: formatMessage('TIMEWARP', body) });
    }
};