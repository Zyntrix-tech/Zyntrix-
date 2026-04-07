const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "blush",
    aliases: ["≡ƒÿ│", "shy", "embarrassed"],
    description: "Send a blushing reaction",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        const blushes = [
            "≡ƒÿ│ *goes bright red!*",
            "≡ƒÑ║ *is blushing so hard!*",
            "≡ƒÿå *nervously smiles!*",
            "≡ƒÆò *feels shy!*",
            "≡ƒÿà *turns all shades of red!*"
        ];
        
        const blush = blushes[Math.floor(Math.random() * blushes.length)];
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `≡ƒÿ│ *${sender} blushes at ${target}!*\n\n${blush}\n\n≡ƒÆò So cute!`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `≡ƒÿ│ *${sender} is blushing!*\n\n${blush}\n\n≡ƒÆò Aw!`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
