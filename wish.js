const { createForwardedContext } = require('./_helpers');

const wishes = [
    "✨ May all your dreams come true!",
    "🌟 Wishing you endless happiness!",
    "💫 May your life be filled with love!",
    "⭐ Your wish is our command!",
    "🌈 May rainbow colors brighten your day!",
    "💖 May love surround you always!",
    "🦋 May beautiful things come your way!",
    "🌺 May your heart be full of joy!",
    "🎉 May celebrations fill your life!",
    "🌙 May peaceful nights be yours!"
];

const magicalWishes = [
    "🌟 *A shooting star crosses your path...* Your wish has been heard!",
    "🔮 *The magic 8-ball reveals...* Your wish shall be granted!",
    "✨ *With a wave of the wand...* Abracadabra! Your wish is on its way!",
    "🌙 *Under the moonlight's glow...* Your deepest desire is coming true!",
    "💫 *The universe conspires...* Great things await you!",
    "🦋 *A butterfly lands on your shoulder...* Transformation is coming!",
    "🌈 *A rainbow appears...* Colors of hope fill your world!",
    "🎆 *Fireworks light the sky...* Celebration of your wishes begin!"
];

module.exports = {
    name: "wish",
    aliases: ["makeawish", "wishme"],
    description: "Make a wish",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const wish = args.join(' ') || wishes[Math.floor(Math.random() * wishes.length)];
        const magical = magicalWishes[Math.floor(Math.random() * magicalWishes.length)];
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `🪄 *Making a Wish...*\n\n${magical}\n\n✨ *Your wish:* "${wish}"\n\n🌟 The magic is working... Your wish is being sent to the universe!`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '✨', key: msg.key } });
    }
};
