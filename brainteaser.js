const { createForwardedContext } = require('./_helpers');

const brainteasers = [
    { q: "What has keys but can't open locks?", a: "A piano" },
    { q: "What comes once in a minute, twice in a moment, but never in a thousand years?", a: "The letter M" },
    { q: "I speak without a mouth and hear without ears. What am I?", a: "A telephone" },
    { q: "The more you take, the more you leave behind. What am I?", a: "Footsteps" },
    { q: "What has to be broken before you can use it?", a: "An egg" },
    { q: "I'm tall when I'm young, and I'm short when I'm old. What am I?", a: "A candle" },
    { q: "What is full of holes but still holds water?", a: "A sponge" },
    { q: "What gets wetter the more it dries?", a: "A towel" },
    { q: "What can you hold in your left hand but not in your right?", a: "Your right elbow" },
    { q: "What has a head and a tail but no body?", a: "A coin" },
    { q: "The person who makes it has no need of it. The person who buys it has no use for it. What is it?", a: "A coffin" },
    { q: "What can travel around the world while staying in a corner?", a: "A stamp" },
    { q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", a: "A map" },
    { q: "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?", a: "The letter R" },
    { q: "What can you break, even if you never pick it up or touch it?", a: "A promise" },
    { q: "I go up and down but I never move. What am I?", a: "Stairs" },
    { q: "What has many teeth but can't bite?", a: "A comb" },
    { q: "What is so fragile that saying its name breaks it?", a: "Silence" },
    { q: "What can run but never walks, has a mouth but never talks?", a: "A river" },
    { q: "I have keys but no locks. I have a space but no room. You can enter but can't go outside. What am I?", a: "A keyboard" }
];

module.exports = {
    name: "brainteaser",
    aliases: ["brain", "riddleme"],
    description: "Get a brain teaser question",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const brainteaser = brainteasers[Math.floor(Math.random() * brainteasers.length)];
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `🧠 *Brain Teaser*\n\n${brainteaser.q}\n\n*Type:* !brainteaser reveal to see answer`,
            contextInfo
        }, { quoted: msg });

        // Store the answer for reveal
        if (!global.brainteaserAnswers) global.brainteaserAnswers = {};
        global.brainteaserAnswers[from] = brainteaser.a;
        
        await sock.sendMessage(from, { react: { text: '🤔', key: msg.key } });
    },

    async reveal(sock, msg) {
        const from = msg.key.remoteJid;
        const answer = global.brainteaserAnswers?.[from];
        
        const contextInfo = createForwardedContext();
        
        if (answer) {
            await sock.sendMessage(from, {
                text: `💡 *Answer:* ${answer}`,
                contextInfo
            }, { quoted: msg });
            delete global.brainteaserAnswers[from];
        } else {
            await sock.sendMessage(from, {
                text: "No brainteaser active. Type !brainteaser for a new one!",
                contextInfo
            }, { quoted: msg });
        }
    }
};
