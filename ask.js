const { createForwardedContext } = require('./_helpers');

const responses = [
    "Yes, definitely!",
    "No, absolutely not!",
    "Maybe... ask again later",
    "The stars say yes!",
    "I see a bright future ahead",
    "Not sure, try again",
    "Without a doubt!",
    "My sources say no",
    "Outlook good!",
    "Better not tell you now",
    "Yes, but wait for the right moment",
    "No, but something better is coming",
    "The universe is thinking...",
    "Absolutely!",
    "Nope, not happening"
];

module.exports = {
    name: "ask",
    aliases: ["question", "oracle"],
    description: "Ask the bot a yes/no question",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: `🔮 *Ask the Oracle*\n\n*Usage:* !ask <question>\n\nAsk a yes/no question and get an answer!\n\n*Example:* !ask Will I have a great day?`,
                contextInfo
            }, { quoted: msg });
            return;
        }

        const question = args.join(' ');
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `🔮 *Question:* "${question}"\n\n*Answer:* ${response}`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '🔮', key: msg.key } });
    }
};
