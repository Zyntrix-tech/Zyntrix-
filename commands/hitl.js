const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "fight",
    aliases: ["slap", "hit", "attack"],
    description: "Send a fight/attack message",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        const attacks = [
            "≡ƒÑè *throws a punch!*",
            "≡ƒª╡ *delivers a roundhouse kick!*",
            "≡ƒæè *lands a solid hit!*",
            "≡ƒÆÑ *unleashes a devastating combo!*",
            "≡ƒöÑ *uses fire fist!*",
            "ΓÜí *strikes with lightning speed!*"
        ];
        
        const attack = attacks[Math.floor(Math.random() * attacks.length)];
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `ΓÜö∩╕Å *${sender} attacks ${target}!*\n\n${attack}\n\n≡ƒÆÑ *KO!*`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `ΓÜö∩╕Å *${sender} wants to fight!*\n\n${attack}\n\n≡ƒÑè Who's next?`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
