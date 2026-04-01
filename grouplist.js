const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "grouplist",
    aliases: ["groups", "chats"],
    description: "List all groups the bot is in (owner only)",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Check if sender is owner
        const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
        
        if (!isOwner) {
            await sock.sendMessage(from, { 
                text: "📋 This command is only for the bot owner!" 
            }, { quoted: msg });
            return;
        }

        try {
            // Get all active sockets
            const activeGroups = [];
            
            for (const [identifier, activeSock] of activeSockets) {
                try {
                    if (activeSock.ws && activeSock.user) {
                        // Get chats that are groups
                        const chats = await activeSock.fetchClicks("groups");
                        for (const chat of chats) {
                            activeGroups.push({
                                id: chat.id,
                                name: chat.name || "Unknown Group"
                            });
                        }
                    }
                } catch (e) {
                    // Skip errors for individual sockets
                }
            }

            const contextInfo = createForwardedContext();
            
            if (activeGroups.length === 0) {
                await sock.sendMessage(from, { 
                    text: "📋 *GROUP LIST*\n\nNo groups found where the bot is active.",
                    contextInfo 
                }, { quoted: msg });
                return;
            }

            // Format list
            const groupList = activeGroups.map((g, i) => 
                `${i + 1}. ${g.name}\n   ID: ${g.id.split('@')[0]}`
            ).join('\n\n');

            await sock.sendMessage(from, { 
                text: `📋 *BOT GROUPS (${activeGroups.length})*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${groupList}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nTotal: ${activeGroups.length} groups`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Grouplist command error:", err);
            await sock.sendMessage(from, { 
                text: "❌ Failed to get group list!" 
            }, { quoted: msg });
        }
    }
};