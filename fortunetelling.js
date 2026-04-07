const { createForwardedContext } = require('./_helpers');

const fortunes = [
    "≡ƒîƒ A great adventure awaits you soon!",
    "≡ƒÆ½ Your hard work will pay off soon.",
    "Γ£¿ Someone special is thinking of you.",
    "≡ƒÄ» Your dreams are within reach.",
    "≡ƒÆÄ Great fortune comes to those who wait.",
    "≡ƒîê After rain comes sunshine.",
    "≡ƒÜÇ Your future is brighter than you think.",
    "≡ƒÆû Love is in the air for you.",
    "≡ƒÄü Something wonderful is coming your way.",
    "ΓÜí Your energy will attract success.",
    "≡ƒªï Big changes are coming your way.",
    "≡ƒî║ Happiness will find you when you least expect it.",
    "≡ƒÆ¬ Your courage will be rewarded.",
    "≡ƒÄ¡ Your life is about to get interesting.",
    "≡ƒîÖ Trust your instincts - they won't betray you.",
    "≡ƒöÑ Something exciting is about to happen.",
    "Γ¡É Your patience will be rewarded.",
    "≡ƒÄ¬ A surprise awaits around the corner.",
    "≡ƒÆ½ The universe is working in your favor.",
    "≡ƒî╗ Good luck follows you everywhere."
];

const luckyNumbers = () => {
    const nums = [];
    while(nums.length < 6) {
        const r = Math.floor(Math.random() * 99) + 1;
        if(nums.indexOf(r) === -1) nums.push(r);
    }
    return nums.sort((a,b) => a-b).join(', ');
};

module.exports = {
    name: "fortunetelling",
    aliases: ["fortune", "luck", "oracle"],
    description: "Get your fortune told",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        const numbers = luckyNumbers();
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `≡ƒö« *Fortune Teller*\n\n${fortune}\n\n*Lucky Numbers:* ${numbers}\n\nΓ£¿ The stars align in your favor!`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '≡ƒö«', key: msg.key } });
    }
};
