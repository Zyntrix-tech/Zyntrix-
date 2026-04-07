const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "clap",
    aliases: ["≡ƒæÅ", "applause", "bravo"],
    description: "Add clap emojis to text",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        if (args.length === 0) {
            await sock.sendMessage(from, { 
                text: "≡ƒæÅ *CLAP EMOJIS*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !clap <text>\n\nExample: !clap Well done\n\nAdds ≡ƒæÅ between words!",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const text = args.join(" ");
        const clappedText = text.split(" ").join(" ≡ƒæÅ ");
        
        await sock.sendMessage(from, { 
            text: `≡ƒæÅ *CLAP!*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n${clappedText} ≡ƒæÅ\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü`,
            contextInfo 
        }, { quoted: msg });
    }
};
