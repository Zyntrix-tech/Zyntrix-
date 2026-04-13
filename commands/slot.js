const { createForwardedContext } = require('./_helpers');

const emojis = ['≡ƒìÆ', '≡ƒìï', '≡ƒìç', '≡ƒÆÄ', '≡ƒöö', 'Γ¡É', '7∩╕ÅΓâú'];
const jackpot = '≡ƒÆÄ≡ƒÆÄ≡ƒÆÄ';

module.exports = {
    name: "slot",
    aliases: ["slots", "casino"],
    description: "Play a slot machine game",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        await sock.sendMessage(from, { react: { text: '≡ƒÄ░', key: msg.key } });
        
        const spin = () => {
            return Array(3).fill(0).map(() => emojis[Math.floor(Math.random() * emojis.length)]);
        };
        
        const result = spin();
        const resultStr = result.join(' ');
        
        let message;
        
        if (result[0] === result[1] && result[1] === result[2]) {
            message = `≡ƒÄ░ *JACKPOT!*\n\n${resultStr}\n\n≡ƒÄë YOU WIN! ≡ƒÄë`;
        } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
            message = `≡ƒÄ░ *SPIN RESULT*\n\n${resultStr}\n\nΓ£¿ Close! You almost had it!`;
        } else {
            message = `≡ƒÄ░ *SPIN RESULT*\n\n${resultStr}\n\nΓ¥î Better luck next time!`;
        }
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, { 
            text: message,
            contextInfo 
        }, { quoted: msg });
    }
};
