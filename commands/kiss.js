const { createForwardedContext } = require('./_helpers');

const kisses = [
    "≡ƒÆï *Sends a sweet kiss!*",
    "≡ƒÿÿ *Muaah!*",
    "≡ƒÆò *Smooch!*",
    "≡ƒÑ░ *Love kiss!*",
    "Γ£¿ *Magical kiss!*",
    "≡ƒÆû *Heart kiss!*",
    "≡ƒÿÜ *Soft kiss!*",
    "≡ƒî╕ *Butterfly kiss!*"
];

module.exports = {
    name: "kiss",
    aliases: ["kisses", "smooch", "muah"],
    description: "Send a virtual kiss",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        const kiss = kisses[Math.floor(Math.random() * kisses.length)];
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `≡ƒÆï *${sender} kisses ${target}!*\n\n${kiss}\n\n≡ƒÆò Love is in the air!`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `≡ƒÆï *${sender} blows a kiss!*\n\n${kiss}\n\n≡ƒÿÿ *Muah!*`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
