const { createForwardedContext } = require('./_helpers');

const greetings = [
    "≡ƒîà *Good morning! May your day be as bright as the sun!*",
    "ΓÿÇ∩╕Å *Rise and shine! Today's going to be amazing!*",
    "≡ƒî₧ *Morning vibes! Make today count!*",
    "Γ£¿ *New day, new opportunities! Go crush it!*",
    "≡ƒî╗ *Good morning! Stay positive, happy, and blessed!*",
    "≡ƒÆ¬ *Wake up with determination! Go get 'em!*",
    "≡ƒîê *Start your day with a smile!*",
    "Γÿò *Coffee time! Have a great day ahead!*",
    "≡ƒÄë *It's a brand new day! Make it memorable!*",
    "≡ƒî╕ *Sending you morning sunshine and positive vibes!*"
];

module.exports = {
    name: "goodmorning",
    aliases: ["gm", "morning", "greeting"],
    description: "Good morning wishes",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        await sock.sendMessage(from, { 
            text: `ΓÿÇ∩╕Å *GOOD MORNING!*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n${greeting}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓ£¿ Have an amazing day! Use !goodnight for evening wishes!`,
            contextInfo 
        }, { quoted: msg });
    }
};
