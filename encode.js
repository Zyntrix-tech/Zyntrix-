const { createForwardedContext } = require('./_helpers');

const base64Encode = (str) => Buffer.from(str).toString('base64');
const hexEncode = (str) => {
    let hex = '';
    for(let i=0;i<str.length;i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2,'0');
    }
    return hex;
};
const urlEncode = (str) => encodeURIComponent(str);

module.exports = {
    name: "encode",
    aliases: ["enc"],
    description: "Encode text to various formats",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: `🔐 *Encode Tool*\n\n*Usage:* !encode <text>\n\nEncodes your text to Base64, Hex, and URL formats.\n\n*Example:* !encode hello`,
                contextInfo
            }, { quoted: msg });
            return;
        }

        const text = args.join(' ');
        const base64 = base64Encode(text);
        const hex = hexEncode(text);
        const url = urlEncode(text);

        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `🔐 *Encoded:* "${text}"\n\n*Base64:* \`${base64}\`\n\n*Hex:* \`${hex}\`\n\n*URL:* \`${url}\``,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '🔐', key: msg.key } });
    }
};
