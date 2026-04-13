const { createForwardedContext } = require('./_helpers');

const pats = [
    "≡ƒÉ▒ *Gentle pat on the head!*",
    "≡ƒûÉ∩╕Å *Pat pat pat!*",
    "Γ£¿ *Soft head pat!*",
    "≡ƒÆò *Friendly pat!*",
    "≡ƒîƒ *Encouraging pat!*",
    "≡ƒÉò *Good boy/girl pat!*",
    "≡ƒÿè *Comforting pat!*",
    "≡ƒñÜ *Pat pat!*"
];

module.exports = {
    name: "pat",
    aliases: ["pathead", "headpat", "pet"],
    description: "Pat someone on the head",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        const pat = pats[Math.floor(Math.random() * pats.length)];
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `≡ƒÉ▒ *${sender} pats ${target}'s head!*\n\n${pat}\n\n≡ƒÆò So cute!`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `≡ƒÉ▒ *${sender} wants a head pat!*\n\n${pat}\n\n≡ƒÆò *Pat pat!*`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
