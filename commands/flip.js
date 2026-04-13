const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "flip",
    aliases: ["coin", "coinflip", "roll"],
    description: "Flip a coin or roll a dice",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        const type = args[0]?.toLowerCase();
        const contextInfo = createForwardedContext();
        
        if (type === 'dice' || type === 'd') {
            // Roll dice
            const sides = parseInt(args[1]) || 6;
            const roll = Math.floor(Math.random() * sides) + 1;
            
            const emojis = ['ΓÜÇ', 'ΓÜü', 'ΓÜé', 'ΓÜâ', 'ΓÜä', 'ΓÜà'];
            const emoji = sides <= 6 ? emojis[roll - 1] : '≡ƒÄ▓';
            
            await sock.sendMessage(from, { 
                text: `≡ƒÄ▓ Dice Roll (${sides} sides):\n\n${emoji} ${roll}`,
                contextInfo 
            }, { quoted: msg });
            
        } else if (type && type.startsWith('d')) {
            // Custom dice like !flip d20
            const sides = parseInt(type.substring(1)) || 6;
            const roll = Math.floor(Math.random() * sides) + 1;
            
            await sock.sendMessage(from, { 
                text: `≡ƒÄ▓ D${sides} Roll:\n\n≡ƒÄ▓ ${roll}`,
                contextInfo 
            }, { quoted: msg });
            
        } else if (type === 'number' || type === 'n') {
            // Random number
            const min = parseInt(args[1]) || 1;
            const max = parseInt(args[2]) || 100;
            const random = Math.floor(Math.random() * (max - min + 1)) + min;
            
            await sock.sendMessage(from, { 
                text: `≡ƒÄ▓ Random Number (${min}-${max}):\n\n≡ƒöó ${random}`,
                contextInfo 
            }, { quoted: msg });
            
        } else {
            // Coin flip
            const result = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
            const emoji = result === 'HEADS' ? '≡ƒ¬Ö' : '≡ƒöä';
            
            await sock.sendMessage(from, { 
                text: `≡ƒ¬Ö Coin Flip:\n\n${emoji} ${result}`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
