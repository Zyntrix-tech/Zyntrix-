const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "unmute",
    aliases: ["unlock", "open"],
    description: "Unmute the group - allow everyone to send messages",

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "🔊 This command only works in groups!" 
            }, { quoted: msg });
            return;
        }

        const sender = msg.key.participant || msg.key.remoteJid;
        
        try {
            // Get group metadata
            const metadata = await sock.groupMetadata(jid);
            const participant = metadata.participants.find(p => p.id === sender);
            const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
            const botAdmin = metadata.participants.find(p => p.id === sock.user?.id)?.admin === "admin" || 
                             metadata.participants.find(p => p.id === sock.user?.id)?.admin === "superadmin";
            
            // Check if sender is admin or owner
            const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
            
            if (!isAdmin && !isOwner) {
                await sock.sendMessage(jid, { 
                    text: "🔊 Only admins can use this command!" 
                }, { quoted: msg });
                return;
            }

            if (!botAdmin) {
                await sock.sendMessage(jid, { 
                    text: "🔊 I need admin rights to unmute the group!" 
                }, { quoted: msg });
                return;
            }

            // Unmute the group (allow everyone to send)
            await sock.groupSettingUpdate(jid, "not_announcement");
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(jid, { 
                text: `🔊 *GROUP UNMUTED*\n\nEveryone can now send messages!\n\nUse !mute to restrict to admins only.`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Unmute command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to unmute the group. Make sure I'm an admin!" 
            }, { quoted: msg });
        }
    }
};