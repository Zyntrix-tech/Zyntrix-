const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "mute",
    aliases: ["silence", "lock"],
    description: "Mute the group - only admins can send messages",

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "🔇 This command only works in groups!" 
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
                    text: "🔇 Only admins can use this command!" 
                }, { quoted: msg });
                return;
            }

            if (!botAdmin) {
                await sock.sendMessage(jid, { 
                    text: "🔇 I need admin rights to mute the group!" 
                }, { quoted: msg });
                return;
            }

            // Mute the group (only admins can send)
            await sock.groupSettingUpdate(jid, "announcement");
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(jid, { 
                text: `🔇 *GROUP MUTED*\n\nOnly admins can now send messages!\n\nUse !unmute to allow everyone to chat.`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Mute command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to mute the group. Make sure I'm an admin!" 
            }, { quoted: msg });
        }
    }
};