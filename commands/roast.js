const { createForwardedContext } = require('./_helpers');

const roasts = [
    "≡ƒöÑ You're proof that evolution can go backwards!",
    "≡ƒÿé I'd agree with you but then we'd both be wrong!",
    "≡ƒÿ┤ You're the reason the pillow was invented!",
    "≡ƒñí You're not stupid; you just have bad luck thinking!",
    "≡ƒÆÇ If you were any more inbred, you'd be a sandwich!",
    "≡ƒÉó You're so slow, even the snail passed you!",
    "≡ƒºá You're the reason god created the delete button!",
    "≡ƒæÇ If you were any more inbred, you'd be a cornbread!",
    "≡ƒî╡ You're so dry, the Sahara is jealous!",
    "≡ƒª┤ You're the bone to pick!",
    "≡ƒô▒ You're like a smartphone - full of apps but not smart!",
    "≡ƒÄ¡ You're the whole circus!",
    "≡ƒÆ⌐ You're the cherry on top of the garbage cake!",
    "≡ƒªå You're like a duck - calm on top, paddling like crazy underneath!",
    "≡ƒÜ╜ You're the flush that didn't go through!",
    "≡ƒÉÆ Evolution skip you?",
    "≡ƒì¬ You're like a cookie - crumbles!",
    "≡ƒÄ» You miss 100% of the shots you don't take - oh wait, that's everything!",
    "≡ƒºé You're so salty, the ocean is jealous!",
    "≡ƒî╗ You're like the sun - hot air with nothing inside!",
    "≡ƒôª You're an empty box!",
    "≡ƒÄ¬ The circus called - they want their clown back!",
    "≡ƒªá You're not a virus, but you should be quarantined!",
    "≡ƒìé You're so dead inside, the zombie apocalypse looks at you with envy!",
    "≡ƒÆ┐ You're like a CD - burned out and worthless!"
];

module.exports = {
    name: "roast",
    aliases: ["burn", "roastme", "fire"],
    description: "Roast someone (playful banter)",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        if (args.length > 0) {
            const target = args.join(" ");
            const roast = roasts[Math.floor(Math.random() * roasts.length)];
            
            await sock.sendMessage(from, { 
                text: `≡ƒöÑ *ROASTING ${target}:*\n\n${roast}\n\n≡ƒöÑ≡ƒöÑ ≡ƒöÑ`,
                contextInfo 
            }, { quoted: msg });
        } else {
            // Roasting the person who asked
            const roast = roasts[Math.floor(Math.random() * roasts.length)];
            
            await sock.sendMessage(from, { 
                text: `≡ƒöÑ *Roasting ${sender}:*\n\n${roast}\n\n≡ƒÿé Don't @ me!`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
