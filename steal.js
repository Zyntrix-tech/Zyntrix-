const { createContextWithButtons } = require('./_helpers');

module.exports = {
    name: "steal",
    aliases: ["pfp", "avatar", "copy"],
    description: "Copy someone's profile picture",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        // Get target from reply or mention
        let targetJid;
        let targetName = "User";
        
        if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            // User replied to a message
            targetJid = msg.message.extendedTextMessage.contextInfo.participant;
            targetName = msg.message.extendedTextMessage.contextInfo?.quotedMessage?.pushName || "User";
        } else if (args.length > 0) {
            // User mentioned someone
            targetJid = args[0].includes('@') ? args[0] : `${args[0]}@s.whatsapp.net`;
            targetName = args.slice(1).join(" ") || "User";
        } else {
            const contextInfo = createContextWithButtons();
            await sock.sendMessage(from, { 
                text: `📸 *PROFILE PICTURE STEALER*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !steal @user\n\nOr reply to someone's message with !steal\n\nExample: !steal @john`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        await sock.sendMessage(from, { 
            react: { text: '📸', key: msg.key } 
        });

        // Simulate fetching profile picture
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate placeholder result
        const contextInfo = createContextWithButtons();
        
        await sock.sendMessage(from, { 
            text: `📸 *PROFILE PICTURE COPIED!*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n👤 *Target:* ${targetName}\n\n📥 *Profile saved to gallery!*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 *Note:* This is just a fun simulation!\n\nUse !wasted on someone to add the wasted effect!`,
            contextInfo 
        }, { quoted: msg });

        await sock.sendMessage(from, { 
            react: { text: '✅', key: msg.key } 
        });
    }
};