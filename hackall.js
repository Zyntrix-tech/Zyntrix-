const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "hackall",
    aliases: ["hackmembers", "haxall"],

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
        const memberCount = groupInfo?.participants?.length || 0;
        const groupName = groupInfo?.subject || "this group";
        
        const hackMessages = [
            `≡ƒæÑ MASS MEMBER HACK\n\nGroup: ${groupName}\nMembers detected: ${memberCount}\n\n[ΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæ] 10% - Scanning members...`,
            `≡ƒæÑ MASS MEMBER HACK\n\nGroup: ${groupName}\nMembers detected: ${memberCount}\n\n[ΓûêΓûêΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæ] 25% - Gathering data...`,
            `≡ƒæÑ MASS MEMBER HACK\n\nGroup: ${groupName}\nMembers detected: ${memberCount}\n\n[ΓûêΓûêΓûêΓûêΓûêΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæ] 45% - Extracting info...`,
            `≡ƒæÑ MASS MEMBER HACK\n\nGroup: ${groupName}\nMembers detected: ${memberCount}\n\n[ΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæΓûæ] 65% - Cracking phones...`,
            `≡ƒæÑ MASS MEMBER HACK\n\nGroup: ${groupName}\nMembers detected: ${memberCount}\n\n[ΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûæΓûæΓûæΓûæΓûæΓûæ] 85% - Downloading data...`,
            `≡ƒæÑ MASS MEMBER HACK\n\nGroup: ${groupName}\nMembers detected: ${memberCount}\n\n[ΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûæΓûæΓûæΓûæ] 95% - Finalizing...`,
            `≡ƒæÑ MASS MEMBER HACK\n\nGroup: ${groupName}\nMembers detected: ${memberCount}\n\n[ΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓûæ] 100% - COMPLETE!`
        ];

        const finalResult = `≡ƒÆÇ MASS HACK COMPLETE!\n\nΓöîΓöÇ ${groupName} ΓöÇΓöÉ\nΓöé Members Hacked: ${memberCount}\nΓöé Phone Numbers: Γ£ô STOLEN\nΓöé Profile Pics: Γ£ô COPIED\nΓöé Status Info: Γ£ô EXPOSED\nΓöé Last Seen: Γ£ô TRACKED\nΓöé Devices: Γ£ô ROOTED\nΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ\n\n≡ƒöÑ All ${memberCount} members have been successfully hacked!\n\n≡ƒôè Total data collected: ${(memberCount * 2.5).toFixed(1)} GB`;

        const contextInfo = createForwardedContext();
        
        // Send hacking process
        for (let i = 0; i < hackMessages.length; i++) {
            await sock.sendMessage(from, {
                text: hackMessages[i],
                contextInfo
            }, { quoted: msg });
            
            if (i < hackMessages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 600));
            }
        }
        
        // Send final result
        await sock.sendMessage(from, {
            text: finalResult,
            contextInfo
        }, { quoted: msg });
    }
};
