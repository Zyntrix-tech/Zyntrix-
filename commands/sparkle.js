const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "sparkle",
    aliases: ["Γ£¿", "stars", "magic"],
    description: "Add sparkle emojis to text",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        if (args.length === 0) {
            await sock.sendMessage(from, { 
                text: "Γ£¿ *SPARKLE TEXT*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !sparkle <text>\n\nExample: !sparkle Magic\n\nAdds Γ£¿ to your text!",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const text = args.join(" ");
        
        await sock.sendMessage(from, { 
            text: `Γ£¿Γ£¿Γ£¿ Γ£¿Γ£¿ Γ£¿\n\n${text}\n\nΓ£¿Γ£¿ Γ£¿Γ£¿ Γ£¿Γ£¿`,
            contextInfo 
        }, { quoted: msg });
    }
};
