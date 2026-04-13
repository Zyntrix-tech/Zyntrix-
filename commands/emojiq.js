const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "guess",
    aliases: ["emoji", "guessemoji", "quiz"],
    description: "Emoji guessing game",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        await sock.sendMessage(from, { react: { text: '≡ƒÄ»', key: msg.key } });
        
        const puzzles = [
            { emoji: "≡ƒîº∩╕ÅΓÿÇ∩╕Å", answer: "Rainbow" },
            { emoji: "ΓÅ░≡ƒÆú", answer: "Time bomb" },
            { emoji: "≡ƒîÖ≡ƒÆñ", answer: "Good night / Sleep" },
            { emoji: "≡ƒöÑ≡ƒÉ╢", answer: "Hot dog" },
            { emoji: "≡ƒî╗≡ƒÉ¥", answer: "Honey" },
            { emoji: "≡ƒìÄ≡ƒô▒", answer: "iPhone" },
            { emoji: "≡ƒæ╗≡ƒÅá", answer: "Haunted house" },
            { emoji: "≡ƒªü≡ƒææ", answer: "Lion king" },
            { emoji: "≡ƒî╜≡ƒì₧", answer: "Cornbread" },
            { emoji: "≡ƒÄé≡ƒò»∩╕Å", answer: "Birthday cake" }
        ];
        
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, { 
            text: "≡ƒÄ» *GUESS THE EMOJI*\n\n" + puzzle.emoji + "\n\nReply with your answer!",
            contextInfo 
        }, { quoted: msg });
    }
};
