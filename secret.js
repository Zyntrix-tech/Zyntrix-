const { createContextWithButtons } = require('./_helpers');

module.exports = {
    name: "secret",
    aliases: ["dm", "ghost"],
    description: "Send a secret anonymous message",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Anonymous";
        
        if (args.length < 1) {
            const contextInfo = createContextWithButtons();
            await sock.sendMessage(from, { 
                text: `🤫 *SECRET MESSAGE*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !secret <message>\n\nSends an anonymous message to the group!\n\nExample: !secret Hello everyone!`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        const secretMessage = args.join(" ");
        
        // Anonymous messages
        const messages = [
            "🤫 *Secret Message:*",
            "🔒 *Anonymous:*",
            "👤 *Mystery:*",
            "🕵️ *Unknown:*"
        ];
        
        const prefix = messages[Math.floor(Math.random() * messages.length)];
        
        const contextInfo = createContextWithButtons();
        
        await sock.sendMessage(from, { 
            text: `${prefix}\n\n${secretMessage}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Sent anonymously!`,
            contextInfo 
        }, { quoted: msg });
    }
};