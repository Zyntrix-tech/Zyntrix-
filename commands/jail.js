const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "jail",
    aliases: ["wanted", "prison", "arrest"],
    description: "Send someone to jail (meme)",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        if (args.length === 0) {
            await sock.sendMessage(from, { 
                text: "≡ƒÜö *JAIL COMMAND*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !jail <name>\n\nExample: !jail John\n\n≡ƒÜ¿ Send someone to jail! (Fun meme)",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const target = args.join(" ");
        const crimes = [
            "Being too handsome",
            "Stealing hearts",
            "Bad puns",
            "Cracking bad jokes",
            "Spreading vibes",
            "Being too cool",
            "Loving too much",
            "Being awesome",
            "Existing too much"
        ];
        const crime = crimes[Math.floor(Math.random() * crimes.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒÜö *WANTED: ${target}*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒô£ *CRIME:* ${crime}\n\n≡ƒÆ░ *REWARD:* $1,000,000\n\n≡ƒæñ *STATUS:* LOCKED UP!\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÿà Just a joke! No one is actually arrested!`,
                contextInfo 
            }, { quoted: msg });
    }
};
