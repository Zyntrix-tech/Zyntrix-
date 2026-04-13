const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "dance",
    aliases: ["≡ƒÆâ", "party", "groove"],
    description: "Send a dancing reaction",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        const dances = [
            "≡ƒÆâ *starts dancing!*",
            "≡ƒò║ *is grooving!*",
            "≡ƒÆ½ *drops the beat!*",
            "≡ƒÄ╢ *gets down!*",
            "≡ƒÄ╡ *is vibing hard!*"
        ];
        
        const dance = dances[Math.floor(Math.random() * dances.length)];
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `≡ƒÆâ *${sender} dances with ${target}!*\n\n${dance}\n\n≡ƒÄë Party time!`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `≡ƒÆâ *${sender} is dancing!*\n\n${dance}\n\n≡ƒÄ╢ Let's groove!`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
