const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "like",
    aliases: ["≡ƒæì", "thumbsup", "approve"],
    description: "Send a like/thumbs up reaction",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `≡ƒæì *${sender} likes ${target}!*\n\n≡ƒæì *Thumbs up!*`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `≡ƒæì *${sender} gives a thumbs up!*\n\n≡ƒæì *Looking good!*`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
