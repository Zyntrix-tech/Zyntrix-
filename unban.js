const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "unban",
    aliases: ["unbanish", "pardon"],
    description: "Unban a previously banned user",

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "❌ This command only works in groups!" 
            }, { quoted: msg });
            return;
        }

        const sender = msg.key.participant || msg.key.remoteJid;
        
        try {
            // Get group metadata
            const metadata = await sock.groupMetadata(jid);
            const participant = metadata.participants.find(p => p.id === sender);
            const isAdmin = participant?.admin === "admin" || participant?.admin === "superadmin";
            
            // Check if sender is admin or owner
            const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
            
            if (!isAdmin && !isOwner) {
                await sock.sendMessage(jid, { 
                    text: "❌ Only admins can use this command!" 
                }, { quoted: msg });
                return;
            }

            // Parse arguments: !unban @user or reply to message
            if (args.length < 1 && !msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                const contextInfo = createForwardedContext();
                await sock.sendMessage(jid, { 
                    text: `❌ *UNBAN USER*\n\nUsage: !unban @user\n\nExample: !unban @john\n\nOr reply to a banned user's message with !unban`,
                    contextInfo 
                }, { quoted: msg });
                return;
            }

            // Get target user
            let target;
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                target = msg.message.extendedTextMessage.contextInfo.participant;
            } else {
                target = args[0];
            }

            if (!target || !target.includes('@')) {
                await sock.sendMessage(jid, { 
                    text: "❌ Please mention a user or reply to their message!" 
                }, { quoted: msg });
                return;
            }

            // Convert to proper JID format for adding back
            const targetJid = target.replace('@s.whatsapp.net', '@c.us').replace('@lid', '@s.whatsapp.net');
            
            // Try to add them back (unban)
            await sock.groupParticipantsUpdate(jid, [targetJid], "add");
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(jid, { 
                text: `✅ *USER UNBANNED*\n\n👤 User: ${target}\n\nThe user can now continue messaging this group and do not continue with your bad habits!`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Unban command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to unban user. The user might not be in the ban list or I'm not an admin!" 
            }, { quoted: msg });
        }
    }
};