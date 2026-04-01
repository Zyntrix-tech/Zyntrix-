const fs = require('fs');

const art = {
    stars: ['✦', '✧', '★', '☆', '✶', '✷'],
    sparkles: ['✨', '💫', '⭐', '🌟', '✴️', '❇️'],
    hearts: ['❤', '💖', '💕', '💗', '♥', '💓'],
    fire: ['🔥', '🔥', '🔥', '⚡', '💥', '🌈']
};

const compliments = [
    "✨ 10/10 You're absolutely amazing! ✨",
    "🌟 10/10 You light up every room! 🌟",
    "💫 10/10 Pure magic! 💫",
    "👑 10/10 Royal vibes only! 👑",
    "💎 10/10 Precious gem! 💎",
    "🔥 10/10 On fire! 🔥",
    "⚡ 10/10 Electric energy! ⚡",
    "🌈 10/10 Rainbow soul! 🌈"
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
    name: 'glow',
    aliases: ['shine', 'sparkle', 'glowing'],
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        let mention = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        
        const glowText = args.join(' ') || 'You';
        const glow = getRandom(art.sparkles);
        
        await sock.sendMessage(from, {
            text: `${glow}${glow}${glow}\n\n✨ *GLOW UP* ✨\n\n${glow} *${glowText}* ${glow}\n\n${getRandom(compliments)}\n\n${glow}${glow}${glow}`,
            quoted: msg
        });
    }
};
