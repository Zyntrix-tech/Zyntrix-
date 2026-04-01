const { createContextWithButtons } = require('./_helpers');

module.exports = {
    name: "poll",
    aliases: ["vote", "survey"],
    description: "Create a poll in the group",

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "📊 Polls can only be created in groups!" 
            }, { quoted: msg });
            return;
        }

        // Parse: !poll "Question" | Option1 | Option2 | Option3
        const pollInput = args.join(" ").split("|");
        
        if (pollInput.length < 3) {
            const contextInfo = createContextWithButtons();
            await sock.sendMessage(jid, { 
                text: `📊 *CREATE POLL*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !poll "Question" | Option1 | Option2 | Option3...\n\nExample:\n!poll "Best programming language?" | Python | JavaScript | Java\n\nNote: Use quotes for the question!`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        const question = pollInput[0].trim().replace(/^"|"$/g, '');
        const options = pollInput.slice(1).map(o => o.trim()).filter(o => o);
        
        if (options.length < 2) {
            await sock.sendMessage(jid, { 
                text: "❌ Please provide at least 2 options!" 
            }, { quoted: msg });
            return;
        }

        // Create poll message
        const optionsList = options.map((opt, i) => `${i + 1}. ${opt}`).join("\n");
        
        const contextInfo = createContextWithButtons();
        
        await sock.sendMessage(jid, { 
            text: `📊 *POLL CREATED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n❓ *Question:* ${question}\n\n${optionsList}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💬 Vote by replying with your choice number!`,
            contextInfo 
        }, { quoted: msg });
    }
};