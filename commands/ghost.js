const { formatMessage } = require('../fomatter');

function buildGhostContent() {
    const lines = [
        '👻 Ghost mode activated.',
        'The message will vanish into the ether in 7 seconds.',
        '',
        '╭────────────────────────────╮',
        '│  •  Invisible whisper  •   │',
        '╰────────────────────────────╯',
        '',
        'Try reading it before it disappears...'
    ];
    return lines.join('\n');
}

module.exports = {
    name: 'ghost',
    aliases: ['spirit', 'vanish'],
    description: 'Send an ephemeral ghost text that feels like it disappears.',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const text = buildGhostContent();
        await sock.sendMessage(from, { text: formatMessage('GHOST MODE', text) });
    }
};