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
                text: `≡ƒñ½ *SECRET MESSAGE*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !secret <message>\n\nSends an anonymous message to the group!\n\nExample: !secret Hello everyone!`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        const secretMessage = args.join(" ");
        
        // Anonymous messages
        const messages = [
            "≡ƒñ½ *Secret Message:*",
            "≡ƒöÆ *Anonymous:*",
            "≡ƒæñ *Mystery:*",
            "≡ƒò╡∩╕Å *Unknown:*"
        ];
        
        const prefix = messages[Math.floor(Math.random() * messages.length)];
        
        const contextInfo = createContextWithButtons();
        
        await sock.sendMessage(from, { 
            text: `${prefix}\n\n${secretMessage}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÆí Sent anonymously!`,
            contextInfo 
        }, { quoted: msg });
    }
};
