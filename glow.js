const fs = require('fs');

const art = {
    stars: ['Γ£ª', 'Γ£º', 'Γÿà', 'Γÿå', 'Γ£╢', 'Γ£╖'],
    sparkles: ['Γ£¿', '≡ƒÆ½', 'Γ¡É', '≡ƒîƒ', 'Γ£┤∩╕Å', 'Γ¥ç∩╕Å'],
    hearts: ['Γ¥ñ', '≡ƒÆû', '≡ƒÆò', '≡ƒÆù', 'ΓÖÑ', '≡ƒÆô'],
    fire: ['≡ƒöÑ', '≡ƒöÑ', '≡ƒöÑ', 'ΓÜí', '≡ƒÆÑ', '≡ƒîê']
};

const compliments = [
    "Γ£¿ 10/10 You're absolutely amazing! Γ£¿",
    "≡ƒîƒ 10/10 You light up every room! ≡ƒîƒ",
    "≡ƒÆ½ 10/10 Pure magic! ≡ƒÆ½",
    "≡ƒææ 10/10 Royal vibes only! ≡ƒææ",
    "≡ƒÆÄ 10/10 Precious gem! ≡ƒÆÄ",
    "≡ƒöÑ 10/10 On fire! ≡ƒöÑ",
    "ΓÜí 10/10 Electric energy! ΓÜí",
    "≡ƒîê 10/10 Rainbow soul! ≡ƒîê"
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
            text: `${glow}${glow}${glow}\n\nΓ£¿ *GLOW UP* Γ£¿\n\n${glow} *${glowText}* ${glow}\n\n${getRandom(compliments)}\n\n${glow}${glow}${glow}`,
            quoted: msg
        });
    }
};
