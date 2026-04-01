const { createForwardedContext } = require('./_helpers');

const words = [
    { word: "Serendipity", meaning: "The occurrence of events by chance in a happy or beneficial way" },
    { word: "Ephemeral", meaning: "Lasting for a very short time" },
    { word: "Luminous", meaning: "Full of or shedding light; bright or shining" },
    { word: "Ethereal", meaning: "Extremely delicate and light in a way that seems too perfect for this world" },
    { word: "Mellifluous", meaning: "Sweet or musical; pleasant to hear" },
    { word: "Surreptitious", meaning: "Kept secret, especially because it would not be approved of" },
    { word: "Ineffable", meaning: "Too great or extreme to be expressed or described in words" },
    { word: "Petrichor", meaning: "A pleasant smell that frequently accompanies the first rain after a long period of warm, dry weather" },
    { word: "Sanguine", meaning: "Optimistic or positive, especially in a difficult situation" },
    { word: "Quintessential", meaning: "Representing the most perfect or typical example of a quality or class" },
    { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing" },
    { word: "Resilient", meaning: "Able to withstand or recover quickly from difficult conditions" },
    { word: "Vivid", meaning: "Producing powerfully clear and lively impressions in the mind" },
    { word: "Whimsical", meaning: "Playfully quaint or fanciful, especially in an appealing way" },
    { word: "Nostalgia", meaning: "A sentimental longing or wistful affection for the past" },
    { word: "Enigma", meaning: "A person or thing that is mysterious or difficult to understand" },
    { word: "Solitude", meaning: "The state or situation of being alone" },
    { word: "Radiant", meaning: "Sending out light; shining or glowing brightly" },
    { word: "Zenith", meaning: "The time at which something is most powerful or successful" },
    { word: "Epiphany", meaning: "A moment of sudden revelation or insight" }
];

module.exports = {
    name: "word",
    aliases: ["wordoftheday", "wotd"],
    description: "Get word of the day",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const wordData = words[Math.floor(Math.random() * words.length)];
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `📖 *Word of the Day*\n\n*${wordData.word}*\n\n${wordData.meaning}`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '📖', key: msg.key } });
    }
};
