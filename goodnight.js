const { createForwardedContext } = require('./_helpers');

const wishes = [
    "≡ƒîÖ *Good night! Sweet dreams await you!*",
    "Γ£¿ *Sleep tight! Tomorrow is another adventure!*",
    "≡ƒîƒ *Rest well! You've earned it!*",
    "≡ƒÆ½ *Dream big and sleep peacefully!*",
    "≡ƒî¢ *Night vibes! Let the stars watch over you!*",
    "≡ƒÿ┤ *Time to recharge! See you tomorrow!*",
    "≡ƒîâ *Rest your head, clear your mind!*",
    "≡ƒ¢Å∩╕Å *Sweet dreams are made of this!*",
    "≡ƒîÖ *Sleep like there's no tomorrow!*",
    "Γ£¿ *Close your eyes and drift away!*"
];

module.exports = {
    name: "goodnight",
    aliases: ["gn", "night", "sleep"],
    description: "Good night wishes",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const wish = wishes[Math.floor(Math.random() * wishes.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒîÖ *GOOD NIGHT!*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n${wish}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓ£¿ Rest well! Use !goodmorning to start the day!`,
            contextInfo 
        }, { quoted: msg });
    }
};
