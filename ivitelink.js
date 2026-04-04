const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'ivitelink',
    aliases: ['igrouplink', 'getlink'],
    description: 'Get group invite link',

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "🔗 This command only works in groups!" 
            }, { quoted: msg });
            return;
        }

        const sender = msg.key.participant || msg.key.remoteJid;
        
        try {
            // Get group metadata to check if bot is admin
            const metadata = await sock.groupMetadata(jid);
            const botInGroup = metadata.participants.find(p => p.id === sock.user?.id);
            const isBotAdmin = botInGroup?.admin === "admin" || botInGroup?.admin === "superadmin";
            
            // Check if sender is admin or owner
            const senderInGroup = metadata.participants.find(p => p.id === sender);
            const isSenderAdmin = senderInGroup?.admin === "admin" || senderInGroup?.admin === "superadmin";
            const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
            
            if (!isSenderAdmin && !isOwner) {
                await sock.sendMessage(jid, { 
                    text: "🔗 Only admins can get the invite link!" 
                }, { quoted: msg });
                return;
            }
            
            // Get invite link
            const inviteCode = await sock.groupInviteCode(jid);
            const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
            
            const contextInfo = createForwardedContext();
            
            await sock.sendMessage(jid, { 
                text: `🔗 *GROUP INVITE LINK*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n📛 *Group:* ${metadata.subject}\n\n🔗 *Link:* ${inviteLink}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n📌 Anyone with this link can join the group!\n\n${!isBotAdmin ? '\n⚠️ Note: Bot is not admin, cannot revoke link.' : '\n💡 Use !revoke to generate a new link'}`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Ivitelink command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to get invite link. I need to be an admin!" 
            }, { quoted: msg });
        }
    }
};