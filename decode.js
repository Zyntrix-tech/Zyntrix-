const { createForwardedContext } = require('./_helpers');

const base64Decode = (str) => {
    try {
        return Buffer.from(str, 'base64').toString('utf8');
    } catch { return 'Invalid Base64'; }
};
const hexDecode = (str) => {
    try {
        let hex = str.toString();
        let str2 = '';
        for(let i=0;i<hex.length;i+=2) {
            str2 += String.fromCharCode(parseInt(hex.substr(i,2),16));
        }
        return str2;
    } catch { return 'Invalid Hex'; }
};
const urlDecode = (str) => {
    try {
        return decodeURIComponent(str);
    } catch { return 'Invalid URL encoding'; }
};

module.exports = {
    name: "decode",
    aliases: ["dec"],
    description: "Decode text from various formats",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: `🔓 *Decode Tool*\n\n*Usage:* !decode <encoded_text>\n\nTries to decode Base64, Hex, and URL encoded text.\n\n*Example:* !decode aGVsbG8=`,
                contextInfo
            }, { quoted: msg });
            return;
        }

        const text = args.join(' ');
        
        let result = '';
        let type = '';
        
        // Try each format
        if (/^[A-Za-z0-9+/]+={0,2}$/.test(text) && text.length % 4 === 0) {
            const decoded = base64Decode(text);
            if (decoded !== 'Invalid Base64' && /[\x20-\x7E]/.test(decoded)) {
                result = decoded;
                type = 'Base64';
            }
        }
        
        if (!result && /^[0-9a-fA-F]+$/.test(text) && text.length % 2 === 0) {
            const decoded = hexDecode(text);
            if (decoded !== 'Invalid Hex') {
                result = decoded;
                type = 'Hex';
            }
        }
        
        if (!result && /%[0-9A-Fa-f]{2}/.test(text)) {
            const decoded = urlDecode(text);
            if (decoded !== 'Invalid URL encoding') {
                result = decoded;
                type = 'URL';
            }
        }
        
        if (!result) {
            result = 'Could not decode. Make sure input is valid encoded text.';
            type = 'Unknown';
        }

        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `🔓 *Decoded (${type}):*\n\n\`${result}\``,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '🔓', key: msg.key } });
    }
};
