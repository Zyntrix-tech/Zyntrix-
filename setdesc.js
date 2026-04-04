const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'setdesc',
    aliases: ['setdescription', 'groupdesc'],
    description: 'Change the group description',

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "📝 This command only works in groups!" 
            }, { quoted: msg });
            return;
        }

        const sender = msg.key.participant || msg.key.remoteJid;
        
        try {
            // Get group metadata to check permissions
            const metadata = await sock.groupMetadata(jid);
            const botInGroup = metadata.participants.find(p => p.id === sock.user?.id);
            const isBotAdmin = botInGroup?.admin === "admin" || botInGroup?.admin === "superadmin";
            
            const senderInGroup = metadata.participants.find(p => p.id === sender);
            const isSenderAdmin = senderInGroup?.admin === "admin" || senderInGroup?.admin === "superadmin";
            
            const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
            
            if (!isSenderAdmin && !isOwner) {
                await sock.sendMessage(jid, { 
                    text: "📝 Only admins can change the group description!" 
                }, { quoted: msg });
                return;
            }

            if (!isBotAdmin) {
                await sock.sendMessage(jid, { 
                    text: "📝 I need admin rights to change the group description!" 
                }, { quoted: msg });
                return;
            }

            // Get the new description from args
            const newDesc = args.join(' ').trim();
            
            if (!newDesc) {
                await sock.sendMessage(jid, { 
                    text: "📝 *SET GROUP DESCRIPTION*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !setdesc <new_description>\n\nExample:\n!setdesc Welcome to our awesome group! 🎉" 
                }, { quoted: msg });
                return;
            }

            // Update group description
            await sock.groupUpdateDescription(jid, newDesc);
            
            const contextInfo = createForwardedContext();
            
            await sock.sendMessage(jid, { 
                text: `📝 *GROUP DESCRIPTION UPDATED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Group description has been changed!\n\n📝 *New Description:* ${newDesc}\n\n━━━━━━━━━━━━━━━━━━━━━━`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Setdesc command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to change group description. Make sure I'm an admin!" 
            }, { quoted: msg });
        }
    }
};