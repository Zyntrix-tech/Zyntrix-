const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "fire",
    aliases: ["≡ƒöÑ", "lit", "flames"],
    description: "Add fire emojis to text",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        if (args.length === 0) {
            await sock.sendMessage(from, { 
                text: "≡ƒöÑ *FIRE TEXT*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !fire <text>\n\nExample: !fire That's lit\n\nAdds ≡ƒöÑ to your text!",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const text = args.join(" ");
        
        await sock.sendMessage(from, { 
            text: `≡ƒöÑ≡ƒöÑ≡ƒöÑ ≡ƒöÑ≡ƒöÑ ≡ƒöÑ\n\n${text}\n\n≡ƒöÑ≡ƒöÑ ≡ƒöÑ≡ƒöÑ ≡ƒöÑ≡ƒöÑ`,
            contextInfo 
        }, { quoted: msg });
    }
};
