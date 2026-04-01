const { createForwardedContext } = require('./_helpers');

const textToBinary = (str) => {
    return str.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join(' ');
};

const binaryToText = (str) => {
    const binaries = str.trim().split(/\s+/);
    return binaries.map(bin => {
        return String.fromCharCode(parseInt(bin, 2));
    }).join('');
};

module.exports = {
    name: "binary",
    aliases: ["bin"],
    description: "Convert text to binary and vice versa",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: `🧮 *Binary Converter*\n\n*Usage:* !binary <text>\n\nConverts text to binary or binary to text.\n\n*Examples:*\n• !binary hello → 01101000 01100101...\n• !binary 01101000 01100101 → hello`,
                contextInfo
            }, { quoted: msg });
            return;
        }

        const input = args.join(' ');
        let result = '';
        
        // Check if input is binary
        if (/^[01\s]+$/.test(input)) {
            try {
                result = binaryToText(input);
            } catch {
                result = 'Invalid binary string';
            }
        } else {
            result = textToBinary(input);
        }

        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `🧮 *Binary Conversion*\n\n*Input:* ${input}\n\n*Result:* \`${result}\``,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '🧮', key: msg.key } });
    }
};
