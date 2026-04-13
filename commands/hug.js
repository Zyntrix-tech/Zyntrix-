const { createForwardedContext } = require('./_helpers');

const hugs = [
    "≡ƒñù *Sends a warm, cozy hug!*",
    "≡ƒ½é *Gives a tight, comforting embrace!*",
    "≡ƒÆ¥ *Wraps arms around you gently!*",
    "≡ƒº╕ *Bear hug from a distance!*",
    "Γ£¿ *Magical healing hug!*",
    "≡ƒî╕ *Soft and gentle hug!*",
    "≡ƒöÑ *Warm and cozy hug!*",
    "≡ƒÆò *Friendly hug!*",
    "≡ƒÖå *Big bear hug!*",
    "≡ƒ½╢ *Heartwarming embrace!*"
];

module.exports = {
    name: "hug",
    aliases: ["hugs", "warm", "comfort"],
    description: "Send a virtual hug",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        const hug = hugs[Math.floor(Math.random() * hugs.length)];
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `≡ƒñù *${sender} hugs ${target}!*\n\n${hug}\n\n≡ƒÆò Spread the love!`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `≡ƒñù *${sender} wants a hug!*\n\n${hug}\n\n≡ƒÆò Everyone needs a hug sometimes!`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
