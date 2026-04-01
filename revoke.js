const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "revoke",
    aliases: ["resetlink", "newlink"],
    description: "Revoke and generate a new group invite link",

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
            // Get group metadata to check permissions
            const metadata = await sock.groupMetadata(jid);
            const botInGroup = metadata.participants.find(p => p.id === sock.user?.id);
            const isBotAdmin = botInGroup?.admin === "admin" || botInGroup?.admin === "superadmin";
            
            const senderInGroup = metadata.participants.find(p => p.id === sender);
            const isSenderAdmin = senderInGroup?.admin === "admin" || senderInGroup?.admin === "superadmin";
            
            // Check if sender is admin or owner
            const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
            
            if (!isSenderAdmin && !isOwner) {
                await sock.sendMessage(jid, { 
                    text: "🔗 Only admins can revoke the invite link!" 
                }, { quoted: msg });
                return;
            }

            if (!isBotAdmin) {
                await sock.sendMessage(jid, { 
                    text: "🔗 I need admin rights to revoke the invite link!" 
                }, { quoted: msg });
                return;
            }

            // Revoke the invite link
            await sock.groupRevokeInvite(jid);
            
            // Get new invite link
            const newInviteCode = await sock.groupInviteCode(jid);
            const newInviteLink = `https://chat.whatsapp.com/${newInviteCode}`;
            
            const contextInfo = createForwardedContext();
            
            await sock.sendMessage(jid, { 
                text: `🔗 *INVITE LINK REVOKED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                      `✅ Old link has been invalidated!\n\n` +
                      `📛 Group: ${metadata.subject}\n\n` +
                      `🔗 *New Link:* ${newInviteLink}\n\n` +
                      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                      `⚠️ Share the new link with members who need to join!`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Revoke command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to revoke invite link. Make sure I'm an admin!" 
            }, { quoted: msg });
        }
    }
};