const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "stfu",
    aliases: ["quiet", "shutup"],
    description: "Tell someone to be quiet (playful)",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `≡ƒñÉ *${target}, please be quiet!*\n\n≡ƒñ½ *Shhh!*`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `≡ƒñÉ *${sender} says shhh!*\n\n≡ƒñ½ *Quiet please!*`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
