const { createForwardedContext } = require('./_helpers');

const wishes = [
    "Γ£¿ May all your dreams come true!",
    "≡ƒîƒ Wishing you endless happiness!",
    "≡ƒÆ½ May your life be filled with love!",
    "Γ¡É Your wish is our command!",
    "≡ƒîê May rainbow colors brighten your day!",
    "≡ƒÆû May love surround you always!",
    "≡ƒªï May beautiful things come your way!",
    "≡ƒî║ May your heart be full of joy!",
    "≡ƒÄë May celebrations fill your life!",
    "≡ƒîÖ May peaceful nights be yours!"
];

const magicalWishes = [
    "≡ƒîƒ *A shooting star crosses your path...* Your wish has been heard!",
    "≡ƒö« *The magic 8-ball reveals...* Your wish shall be granted!",
    "Γ£¿ *With a wave of the wand...* Abracadabra! Your wish is on its way!",
    "≡ƒîÖ *Under the moonlight's glow...* Your deepest desire is coming true!",
    "≡ƒÆ½ *The universe conspires...* Great things await you!",
    "≡ƒªï *A butterfly lands on your shoulder...* Transformation is coming!",
    "≡ƒîê *A rainbow appears...* Colors of hope fill your world!",
    "≡ƒÄå *Fireworks light the sky...* Celebration of your wishes begin!"
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
            text: `≡ƒ¬ä *Making a Wish...*\n\n${magical}\n\nΓ£¿ *Your wish:* "${wish}"\n\n≡ƒîƒ The magic is working... Your wish is being sent to the universe!`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: 'Γ£¿', key: msg.key } });
    }
};
