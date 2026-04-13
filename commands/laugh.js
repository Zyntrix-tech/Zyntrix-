const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "laugh",
    aliases: ["≡ƒÿé", "lmao", "funny"],
    description: "Send a laughing reaction",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        const laughs = [
            "≡ƒÿé *is laughing out loud!*",
            "≡ƒñú *can't stop laughing!*",
            "≡ƒÆÇ *died laughing!*",
            "≡ƒÿà *roflmao!*",
            "≡ƒÿé *losing it!*"
        ];
        
        const laugh = laughs[Math.floor(Math.random() * laughs.length)];
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `≡ƒÿé *${sender} laughs at ${target}!*\n\n${laugh}\n\n≡ƒñú Too funny!`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `≡ƒÿé *${sender} is laughing!*\n\n${laugh}\n\n≡ƒñú LOL!`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
