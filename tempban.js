const { createForwardedContext } = require('./_helpers');

// Store temporary bans
const tempBans = new Map();

module.exports = {
    name: "tempban",
    aliases: ["tb", "tempbanish"],
    description: "Ban a user temporarily for specified time",

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "⏱️ This command only works in groups!" 
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
                    text: "⏱️ Only admins can use this command!" 
                }, { quoted: msg });
                return;
            }

            if (!botAdmin) {
                await sock.sendMessage(jid, { 
                    text: "⏱️ I need admin rights to ban users!" 
                }, { quoted: msg });
                return;
            }

            // Parse arguments: !tempban @user <time> [reason]
            // Time format: 1m, 1h, 1d (minutes, hours, days)
            if (args.length < 2) {
                const contextInfo = createForwardedContext();
                await sock.sendMessage(jid, { 
                    text: `⏱️ *TEMPORARY BAN*\n\nUsage: !tempban @user <time> [reason]\n\nExamples:\n• !tempban @user 30m Spamming\n• !tempban @user 2h 1d Rudeness\n• !tempban @user 7d Misbehavior\n\nTime formats: m (minutes), h (hours), d (days)`,
                    contextInfo 
                }, { quoted: msg });
                return;
            }

            // Get target user from mention or reply
            let target = args[0];
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                target = msg.message.extendedTextMessage.contextInfo.participant;
            } else if (!target.includes('@')) {
                await sock.sendMessage(jid, { 
                    text: "❌ Please mention a user or reply to their message!" 
                }, { quoted: msg });
                return;
            }

            // Parse time
            const timeArg = args[1].toLowerCase();
            const timeMatch = timeArg.match(/^(\d+)([mhd])$/i);
            
            if (!timeMatch) {
                await sock.sendMessage(jid, { 
                    text: "❌ Invalid time format! Use: 30m, 2h, 1d (m=minutes, h=hours, d=days)" 
                }, { quoted: msg });
                return;
            }

            const amount = parseInt(timeMatch[1]);
            const unit = timeMatch[2];
            const durationMs = unit === 'm' ? amount * 60 * 1000 : 
                              unit === 'h' ? amount * 60 * 60 * 1000 : 
                              amount * 24 * 60 * 60 * 1000;
            
            // Get reason if provided
            const reason = args.slice(2).join(" ") || "No reason provided";

            // Remove @ from jid
            const targetJid = target.replace('@s.whatsapp.net', '@c.us');
            
            // Ban the user
            await sock.groupParticipantsUpdate(jid, [targetJid], "remove");
            
            // Schedule unban
            setTimeout(async () => {
                try {
                    await sock.groupParticipantsUpdate(jid, [targetJid], "add");
                    // Remove from tempBans
                    const key = `${jid}-${targetJid}`;
                    tempBans.delete(key);
                } catch (e) {
                    console.error("Auto-unban failed:", e);
                }
            }, durationMs);

            // Store temp ban info
            const key = `${jid}-${targetJid}`;
            tempBans.set(key, {
                jid: jid,
                target: targetJid,
                reason: reason,
                duration: `${amount}${unit}`,
                until: Date.now() + durationMs
            });

            const contextInfo = createForwardedContext();
            const durationText = unit === 'm' ? `${amount} minute(s)` : 
                                unit === 'h' ? `${amount} hour(s)` : 
                                `${amount} day(s)`;
            
            await sock.sendMessage(jid, { 
                text: `⏱️ *USER TEMPORARILY BANNED*\n\n👤 User: ${target}\n⏰ Duration: ${durationText}\n📝 Reason: ${reason}\n\nThe user will be automatically unbanned after the duration expires.`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Tempban command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to ban user. Make sure I'm an admin!" 
            }, { quoted: msg });
        }
    }
};