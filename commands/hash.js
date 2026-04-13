const { createContextWithButtons } = require('./_helpers');
const crypto = require('crypto');

module.exports = {
    name: "hash",
    aliases: ["checksum", "md5", "sha"],
    description: "Generate hash of text",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        if (args.length < 2) {
            const contextInfo = createContextWithButtons();
            await sock.sendMessage(from, { 
                text: `≡ƒöÆ *HASH GENERATOR*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !hash <type> <text>\n\nTypes:\nΓÇó md5 - MD5 hash\nΓÇó sha1 - SHA-1 hash\nΓÇó sha256 - SHA-256 hash\nΓÇó sha512 - SHA-512 hash\n\nExample:\n!hash md5 secretpassword\n!hash sha256 mymessage`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        const type = args[0].toLowerCase();
        const text = args.slice(1).join(" ");
        
        let hash = "";
        
        switch (type) {
            case "md5":
                hash = crypto.createHash('md5').update(text).digest('hex');
                break;
            case "sha1":
                hash = crypto.createHash('sha1').update(text).digest('hex');
                break;
            case "sha256":
                hash = crypto.createHash('sha256').update(text).digest('hex');
                break;
            case "sha512":
                hash = crypto.createHash('sha512').update(text).digest('hex');
                break;
            default:
                await sock.sendMessage(from, { 
                    text: "Γ¥î Invalid hash type! Use: md5, sha1, sha256, or sha512" 
                }, { quoted: msg });
                return;
        }

        const contextInfo = createContextWithButtons();
        await sock.sendMessage(from, { 
            text: `≡ƒöÆ *HASH GENERATED (${type.toUpperCase()})*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒô¥ *Input:* ${text}\n\n≡ƒöÉ *Hash:*\n\`\`\`\n${hash}\n\`\`\`\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒôÅ *Length:* ${hash.length} characters`,
            contextInfo 
        }, { quoted: msg });
    }
};
