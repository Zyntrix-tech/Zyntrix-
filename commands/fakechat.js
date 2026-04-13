const { createContextWithButtons } = require('./_helpers');

module.exports = {
    name: "fakechat",
    aliases: ["fchat", "fakewa", "chatgen"],
    description: "Generate a fake WhatsApp chat screenshot",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "User";
        
        if (args.length < 2) {
            const contextInfo = createContextWithButtons();
            await sock.sendMessage(from, { 
                text: `≡ƒÆ¼ *FAKE WHATSAPP CHAT GENERATOR*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !fakechat <name> <message>\n\nExample: !fakechat John Hey, how are you?\n\nCreates a fake chat screenshot!`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        const name = args[0];
        const message = args.slice(1).join(" ");
        
        await sock.sendMessage(from, { 
            react: { text: '≡ƒÆ¼', key: msg.key } 
        });

        // Simulate generating chat
        await new Promise(resolve => setTimeout(resolve, 1500));

        const contextInfo = createContextWithButtons();
        
        // Create fake chat message
        const chatBubble = `≡ƒÆ¼ *FAKE CHAT GENERATED*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒæñ *Name:* ${name}\n\n≡ƒÆ¡ *Message:* "${message}"\n\nΓÅ░ *Time:* ${new Date().toLocaleTimeString()}\n\nΓ£ôΓ£ô Read\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒô╕ *Note:* This is just a simulated chat for fun!\nUse responsibly!`;

        await sock.sendMessage(from, { 
            text: chatBubble,
            contextInfo 
        }, { quoted: msg });

        await sock.sendMessage(from, { 
            react: { text: 'Γ£à', key: msg.key } 
        });
    }
};
