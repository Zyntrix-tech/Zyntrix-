const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "cry",
    aliases: ["sad", "tears", "≡ƒÿ¡"],
    description: "Send crying reaction",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        const cries = [
            "≡ƒÿó * bursts into tears!*",
            "≡ƒÆº *is crying their heart out!*",
            "≡ƒÿ¡ *can't stop crying!*",
            "≡ƒÑ║ *has tears in their eyes!*",
            "≡ƒÿ┐ *is sobbing!*"
        ];
        
        const cry = cries[Math.floor(Math.random() * cries.length)];
        
        if (args.length > 0) {
            const target = args.join(" ");
            await sock.sendMessage(from, { 
                text: `${sender} cries because of ${target}\n\n${cry}\n\n≡ƒÆö Too sad!`,
                contextInfo 
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, { 
                text: `${sender} is crying\n\n${cry}\n\n≡ƒÆö It's okay to cry!`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
