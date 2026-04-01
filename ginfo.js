const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "ginfo",
    aliases: ["groupinfo", "group"],
    description: "Get detailed group information",

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "📋 This command only works in groups!" 
            }, { quoted: msg });
            return;
        }

        try {
            const metadata = await sock.groupMetadata(jid);
            const participants = metadata.participants;
            const admins = participants.filter(p => p.admin === "admin" || p.admin === "superadmin");
            
            // Get creation time if available
            const created = metadata.creation ? new Date(metadata.creation * 1000).toLocaleString() : "Unknown";
            
            // Count members
            const totalMembers = participants.length;
            const totalAdmins = admins.length;
            
            // Get bot info
            const botInGroup = participants.find(p => p.id === sock.user?.id);
            const isBotAdmin = botInGroup?.admin === "admin" || botInGroup?.admin === "superadmin";
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(jid, { 
                text: `📋 *GROUP INFORMATION*\n\n` +
                      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                      `📛 *Name:* ${metadata.subject}\n\n` +
                      `👥 *Members:* ${totalMembers}\n` +
                      `👮 *Admins:* ${totalAdmins}\n` +
                      `🤖 *Bot Status:* ${isBotAdmin ? '✅ Admin' : '❌ Member'}\n\n` +
                      `📅 *Created:* ${created}\n` +
                      `🆔 *Group ID:* ${jid.split('@')[0]}\n\n` +
                      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                      `Use !tagadmin to mention all admins!`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Ginfo command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to get group information!" 
            }, { quoted: msg });
        }
    }
};