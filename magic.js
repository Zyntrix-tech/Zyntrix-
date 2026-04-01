const { createForwardedContext } = require('./_helpers');

const magicTricks = [
    { name: "The Floating Finger", trick: "Place your finger under a table. Ask spectators to hold it down. Secretly lift your finger while saying an incantation. The finger appears to float up!" },
    { name: "The Mental Card", trick: "Think of any card. Ask them to visualize it strongly. Then reveal the card you 'sensed' from their mind." },
    { name: "The Impossible Prediction", trick: "Write a prediction on paper and don't show anyone. Have someone roll dice. Your prediction matches their total!" },
    { name: "The Vanishing Coin", trick: "Place a coin in your palm. Cover it with your other hand. Say the magic word. Open both hands - the coin has vanished!" },
    { name: "The Mind Reader", trick: "Ask someone to think of a number between 1-10. After some 'concentration', you reveal the exact number they thought of." },
    { name: "The Teleporting Ball", trick: "Show a ball in your left hand. Cover it, wave your hand, reveal it in your right hand!" },
    { name: "The Impossible Fold", trick: "Take a piece of paper. Fold it in half. Fold again. When you unfold, there's a secret message visible!" },
    { name: "The Psychic Draw", trick: "Have someone draw anything. Stare at the paper. Describe what they drew with surprising accuracy!" }
];

module.exports = {
    name: "magic",
    aliases: ["magictrick", "trick"],
    description: "Learn a magic trick",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const magic = magicTricks[Math.floor(Math.random() * magicTricks.length)];
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `🎩 *Magic Trick*\n\n*${magic.name}*\n\n${magic.trick}\n\n✨ Practice makes perfect!`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '🎩', key: msg.key } });
    }
};
