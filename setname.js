const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'setname',
    aliases: ['setgroupname', 'groupname'],
    description: 'Change the group name',

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "📛 This command only works in groups!" 
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
                    text: "📛 Only admins can change the group name!" 
                }, { quoted: msg });
                return;
            }

            if (!isBotAdmin) {
                await sock.sendMessage(jid, { 
                    text: "📛 I need admin rights to change the group name!" 
                }, { quoted: msg });
                return;
            }

            // Get the new group name from args
            const newName = args.join(' ').trim();
            
            if (!newName) {
                await sock.sendMessage(jid, { 
                    text: "📛 *SET GROUP NAME*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !setname <new_group_name>\n\nExample:\n!setname My Awesome Group" 
                }, { quoted: msg });
                return;
            }

            // Update group subject
            await sock.groupUpdateSubject(jid, newName);
            
            const contextInfo = createForwardedContext();
            
            await sock.sendMessage(jid, { 
                text: `📛 *GROUP NAME UPDATED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Group name has been changed!\n\n📛 *New Name:* ${newName}\n\n━━━━━━━━━━━━━━━━━━━━━━`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Setname command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to change group name. Make sure I'm an admin!" 
            }, { quoted: msg });
        }
    }
};