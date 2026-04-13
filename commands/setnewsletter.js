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
                text: "≡ƒôó This command only works in groups!" 
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
                    text: "≡ƒôó Only admins can set the newsletter!" 
                }, { quoted: msg });
                return;
            }

            // Get the newsletter link from args
            const newsletterLink = args.join(' ').trim();
            
            if (!newsletterLink) {
                await sock.sendMessage(from, { 
                    text: "≡ƒôó *SET NEWSLETTER*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !setnewsletter <newsletter_link>\n\nExample:\n!setnewsletter https://whatsapp.com/channel/0029Vb..." 
                }, { quoted: msg });
                return;
            }

            // Extract channel code from link
            const channelCodeMatch = newsletterLink.match(/\/channel\/([A-Za-z0-9]+)/);
            const channelCode = channelCodeMatch?.[1];
            
            if (!channelCode) {
                await sock.sendMessage(from, { 
                    text: "Γ¥î Invalid newsletter link! Use a valid WhatsApp channel link." 
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
                text: `≡ƒôó *NEWSLETTER SET*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓ£à Newsletter channel has been set for this group!\n\n≡ƒô░ Channel: ${newsletterLink}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÆí All messages will be forwarded to this channel!`,
                contextInfo 
            }, { quoted: msg });

        } catch (err) {
            console.error("Setnewsletter command error:", err);
            await sock.sendMessage(from, { 
                text: "Γ¥î Failed to set newsletter. Make sure I'm an admin!" 
            }, { quoted: msg });
        }
    }
};
