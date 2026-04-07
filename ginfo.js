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
                text: "≡ƒôï This command only works in groups!" 
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
                text: `≡ƒôï *GROUP INFORMATION*\n\n` +
                      `ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n` +
                      `≡ƒô¢ *Name:* ${metadata.subject}\n\n` +
                      `≡ƒæÑ *Members:* ${totalMembers}\n` +
                      `≡ƒæ« *Admins:* ${totalAdmins}\n` +
                      `≡ƒñû *Bot Status:* ${isBotAdmin ? 'Γ£à Admin' : 'Γ¥î Member'}\n\n` +
                      `≡ƒôà *Created:* ${created}\n` +
                      `≡ƒåö *Group ID:* ${jid.split('@')[0]}\n\n` +
                      `ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n` +
                      `Use !tagadmin to mention all admins!`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Ginfo command error:", err);
            await sock.sendMessage(jid, { 
                text: "Γ¥î Failed to get group information!" 
            }, { quoted: msg });
        }
    }
};
