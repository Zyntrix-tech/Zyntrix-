const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "tagadmin",
    aliases: ["admins", "mentionadmin"],
    description: "Tag all group admins",

    async execute(sock, msg, args = []) {
        const jid = msg.key.remoteJid;
        
        // Check if it's a group
        if (!jid.endsWith("@g.us")) {
            await sock.sendMessage(jid, { 
                text: "📢 This command only works in groups!" 
            }, { quoted: msg });
            return;
        }

        try {
            const metadata = await sock.groupMetadata(jid);
            const participants = metadata.participants;
            
            // Get all admins
            const admins = participants.filter(p => p.admin === "admin" || p.admin === "superadmin");
            
            if (admins.length === 0) {
                await sock.sendMessage(jid, { 
                    text: "❌ No admins found in this group!" 
                }, { quoted: msg });
                return;
            }

            // Create mention list
            const adminMentions = admins.map(a => `@${a.id.split('@')[0]}`).join(' ');
            const mentionedJids = admins.map(a => a.id);

            const contextInfo = createForwardedContext();
            contextInfo.mentionedJid = mentionedJids;

            const reason = args.join(" ") || "Needs attention!";
            
            await sock.sendMessage(jid, { 
                text: `📢 *ADMIN MENTIONED*\n\n${adminMentions}\n\n📝 Message: ${reason}`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Tagadmin command error:", err);
            await sock.sendMessage(jid, { 
                text: "❌ Failed to tag admins!" 
            }, { quoted: msg });
        }
    }
};