const { formatMessage } = require('../fomatter');

function randomMatrixLine(length = 24) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    let line = '';
    for (let i = 0; i < length; i++) {
        line += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return line;
}

module.exports = {
    name: 'matrix',
    aliases: ['rain', 'green'],
    description: 'Send a unique Matrix-style code rain display that feels like something no normal bot does.',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const rows = Math.min(Math.max(Number(args[0]) || 6, 4), 12);
        const lines = Array.from({ length: rows }, () => randomMatrixLine(24));
        const body = `*MATRIX RAIN*

${lines.join('\n')}

>> Enter the code in your mind.`;
        await sock.sendMessage(from, { text: body });
    }
};