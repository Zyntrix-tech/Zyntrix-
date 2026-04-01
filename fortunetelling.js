const { createForwardedContext } = require('./_helpers');

const fortunes = [
    "🌟 A great adventure awaits you soon!",
    "💫 Your hard work will pay off soon.",
    "✨ Someone special is thinking of you.",
    "🎯 Your dreams are within reach.",
    "💎 Great fortune comes to those who wait.",
    "🌈 After rain comes sunshine.",
    "🚀 Your future is brighter than you think.",
    "💖 Love is in the air for you.",
    "🎁 Something wonderful is coming your way.",
    "⚡ Your energy will attract success.",
    "🦋 Big changes are coming your way.",
    "🌺 Happiness will find you when you least expect it.",
    "💪 Your courage will be rewarded.",
    "🎭 Your life is about to get interesting.",
    "🌙 Trust your instincts - they won't betray you.",
    "🔥 Something exciting is about to happen.",
    "⭐ Your patience will be rewarded.",
    "🎪 A surprise awaits around the corner.",
    "💫 The universe is working in your favor.",
    "🌻 Good luck follows you everywhere."
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
            text: `🔮 *Fortune Teller*\n\n${fortune}\n\n*Lucky Numbers:* ${numbers}\n\n✨ The stars align in your favor!`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '🔮', key: msg.key } });
    }
};
