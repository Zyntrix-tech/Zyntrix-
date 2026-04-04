const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'setnewsletter',
    aliases: ['setchannel', 'newsletter'],
    description: 'Set or update the newsletter channel for this group',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Check if it's a group
        if (!from.endsWith("@g.us")) {
            await sock.sendMessage(from, { 
                text: "📢 This command only works in groups!" 
            }, { quoted: msg });
            return;
        }

        // Check if sender is admin or owner
        try {
            const metadata = await sock.groupMetadata(from);
            const senderInGroup = metadata.participants.find(p => p.id === sender);
            const isSenderAdmin = senderInGroup?.admin === "admin" || senderInGroup?.admin === "superadmin";
            const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
            
            if (!isSenderAdmin && !isOwner) {
                await sock.sendMessage(from, { 
                    text: "📢 Only admins can set the newsletter!" 
                }, { quoted: msg });
                return;
            }

            // Get the newsletter link from args
            const newsletterLink = args.join(' ').trim();
            
            if (!newsletterLink) {
                await sock.sendMessage(from, { 
                    text: "📢 *SET NEWSLETTER*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !setnewsletter <newsletter_link>\n\nExample:\n!setnewsletter https://whatsapp.com/channel/0029Vb..." 
                }, { quoted: msg });
                return;
            }

            // Extract channel code from link
            const channelCodeMatch = newsletterLink.match(/\/channel\/([A-Za-z0-9]+)/);
            const channelCode = channelCodeMatch?.[1];
            
            if (!channelCode) {
                await sock.sendMessage(from, { 
                    text: "❌ Invalid newsletter link! Use a valid WhatsApp channel link." 
                }, { quoted: msg });
                return;
            }

            // Store the newsletter for this group
            global.groupNewsletter = global.groupNewsletter || {};
            global.groupNewsletter[from] = {
                link: newsletterLink,
                code: channelCode,
                jid: `${channelCode}@newsletter`
            };

            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `📢 *NEWSLETTER SET*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Newsletter channel has been set for this group!\n\n📰 Channel: ${newsletterLink}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 All messages will be forwarded to this channel!`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Setnewsletter command error:", err);
            await sock.sendMessage(from, { 
                text: "❌ Failed to set newsletter. Make sure I'm an admin!" 
            }, { quoted: msg });
        }
    }
};