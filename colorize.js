const { createForwardedContext } = require('./_helpers');

const colors = [
    { name: "Passion Red", hex: "#FF0000", meaning: "Love, energy, passion" },
    { name: "Ocean Blue", hex: "#0000FF", meaning: "Calm, trust, peace" },
    { name: "Forest Green", hex: "#228B22", meaning: "Nature, growth, harmony" },
    { name: "Sunshine Yellow", hex: "#FFD700", meaning: "Happiness, optimism, joy" },
    { name: "Royal Purple", hex: "#800080", meaning: "Royalty, luxury, creativity" },
    { name: "Sunset Orange", hex: "#FFA500", meaning: "Enthusiasm, creativity, adventure" },
    { name: "Midnight Black", hex: "#000000", meaning: "Power, elegance, mystery" },
    { name: "Pure White", hex: "#FFFFFF", meaning: "Purity, innocence, peace" },
    { name: "Hot Pink", hex: "#FF69B4", meaning: "Playfulness, romance, compassion" },
    { name: "Teal", hex: "#008080", meaning: "Stability, uniqueness, sophistication" },
    { name: "Golden Brown", hex: "#DAA520", meaning: "Reliability, nature, warmth" },
    { name: "Silver Gray", hex: "#C0C0C0", meaning: "Balance, sophistication, calm" },
    { name: "Coral", hex: "#FF7F50", meaning: "Energy, warmth, excitement" },
    { name: "Lavender", hex: "#E6E6FA", meaning: "Femininity, grace, elegance" },
    { name: "Turquoise", hex: "#40E0D0", meaning: "Calm, clarity, creativity" }
];

module.exports = {
    name: "colorize",
    aliases: ["colour", "randomcolor"],
    description: "Get a random color with info",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        let color;
        if (args.length > 0) {
            // Try to find the color by name
            const colorName = args.join(' ').toLowerCase();
            color = colors.find(c => c.name.toLowerCase().includes(colorName));
            if (!color) {
                color = colors[Math.floor(Math.random() * colors.length)];
            }
        } else {
            color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `🎨 *Color Spotlight*\n\n*Name:* ${color.name}\n*Hex:* ${color.hex}\n*Meaning:* ${color.meaning}`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '🎨', key: msg.key } });
    }
};
