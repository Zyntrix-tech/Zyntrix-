const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

const compliments = [
    "≡ƒîƒ You're absolutely amazing!",
    "≡ƒÆ½ You light up every room you enter!",
    "Γ£¿ You're stronger than you know!",
    "≡ƒîê Your smile is contagious!",
    "≡ƒÆû You're one of a kind!",
    "≡ƒöÑ You're doing incredible!",
    "Γ¡É You make the world better!",
    "≡ƒÆÄ You're precious!",
    "≡ƒÄ» You're amazing at being you!",
    "≡ƒî║ You're wonderfully unique!",
    "≡ƒÆ½ Your energy is pure magic!",
    "≡ƒªï You inspire others!",
    "≡ƒî╗ You're a ray of sunshine!",
    "≡ƒÆ¥ You deserve all the happiness!",
    "≡ƒææ You're royalty!",
    "≡ƒî╕ You're beautiful inside and out!",
    "≡ƒÆ¬ You're unstoppable!",
    "≡ƒÄ¡ You're incredibly talented!",
    "Γ¡É You're a star!",
    "≡ƒîÖ You're simply the best!"
];

const sweetMessages = [
    "≡ƒÆò Thinking of you right now!",
    "≡ƒî╕ You're amazing! Don't forget that!",
    "Γ£¿ Sending you positive vibes!",
    "≡ƒÆû You make everything better!",
    "≡ƒî║ You deserve all the love!",
    "Γ¡É Keep shining, beautiful!",
    "≡ƒÆ½ You're stronger than you know!",
    "≡ƒîê Life is better with you in it!"
];

module.exports = {
    name: "compliment",
    aliases: ["sweet", "kind", "love"],
    description: "Send a sweet compliment to someone",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        if (args.length > 0) {
            // Compliment a specific person
            const target = args.join(" ");
            const compliment = compliments[Math.floor(Math.random() * compliments.length)];
            const sweet = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
            
            await sock.sendMessage(from, { 
                text: `≡ƒÆû *Compliment for ${target}:*\n\n${compliment}\n\n${sweet}\n\n_From: ${sender}_`,
                contextInfo 
            }, { quoted: msg });
        } else {
            // General compliment
            const compliment = compliments[Math.floor(Math.random() * compliments.length)];
            
            await sock.sendMessage(from, { 
                text: `≡ƒÆû *Hey ${sender}!*\n\n${compliment}\n\nΓ£¿ You're special just the way you are!`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
