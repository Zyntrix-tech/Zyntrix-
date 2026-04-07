const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "hackgc",
    aliases: ["hackgroup", "haxgc", "grouphack"],

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        
        // Check if it's a group
        if (!isGroup) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: "ΓÜá∩╕Å This command only works in groups!",
                contextInfo
            }, { quoted: msg });
            return;
        }

        const groupInfo = await sock.groupMetadata(from).catch(() => null);
        const groupName = groupInfo?.subject || "this group";
        
        const hackMessages = [
            `≡ƒÅ┤ΓÇìΓÿá∩╕Å GROUP HACK INITIATED\n\nTarget: ${groupName}\n\n[ΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûæΓûæΓûæΓûæΓûæ] 30% - Accessing group data...`,
            `≡ƒÅ┤ΓÇìΓÿá∩╕Å GROUP HACK IN PROGRESS\n\nTarget: ${groupName}\n\n[ΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûæΓûæ] 50% - Downloading member list...`,
            `≡ƒÅ┤ΓÇìΓÿá∩╕Å GROUP HACK IN PROGRESS\n\nTarget: ${groupName}\n\n[ΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûô] 70% - Extracting admin info...`,
            `≡ƒÅ┤ΓÇìΓÿá∩╕Å GROUP HACK IN PROGRESS\n\nTarget: ${groupName}\n\n[ΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûô] 85% - Bypassing privacy...`,
            `≡ƒÅ┤ΓÇìΓÿá∩╕Å GROUP HACK COMPLETE\n\nTarget: ${groupName}\n\n[ΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûô] 100% - DONE!`
        ];

        const finalResult = [
            `≡ƒöÑ GROUP HACKED: ${groupName}\n\nΓöîΓöÇ GROUP DATA ΓöÇΓöÉ\nΓöé Members: EXPOSED\nΓöé Admins: COMPROMISED\nΓöé Messages: COPIED\nΓöé Media: DOWNLOADED\nΓöé Settings: MODIFIED\nΓöé Invite: REGENERATED\nΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ\n\n≡ƒÆÇ Group successfully pwned!`,
            `≡ƒÄ» HACK REPORT - ${groupName}\n\nΓ£ô Admin list extracted\nΓ£ô All members doxxed\nΓ£ô Message history copied\nΓ£ô Media files stolen\nΓ£ô Group settings changed\nΓ£ô Invite link regenerated\nΓ£ô All participants notified\n\n≡ƒÅ┤ΓÇìΓÿá∩╕Å Operation Complete!`
        ];

        const contextInfo = createForwardedContext();
        
        // Send hacking process
        for (let i = 0; i < hackMessages.length; i++) {
            await sock.sendMessage(from, {
                text: hackMessages[i],
                contextInfo
            }, { quoted: msg });
            
            if (i < hackMessages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 700));
            }
        }
        
        // Send final results
        for (const msgText of finalResult) {
            await sock.sendMessage(from, {
                text: msgText,
                contextInfo
            }, { quoted: msg });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
};
