const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "ship",
    aliases: ["couple", "love"],

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        if (args.length < 2) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: "≡ƒÆò Ship Command\n\nUsage: !ship <person1> | <person2>\n\nExample: !ship John | Jane\n        !ship @user1 | @user2",
                contextInfo
            }, { quoted: msg });
            return;
        }

        // Split by | to get the two people
        const parts = args.join(" ").split("|").map(p => p.trim()).filter(p => p);
        
        if (parts.length < 2) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: "Γ¥î Please provide two names separated by |",
                contextInfo
            }, { quoted: msg });
            return;
        }

        const person1 = parts[0];
        const person2 = parts[1];
        
        // Generate a "love percentage" based on names (consistent for same pair)
        const combined = (person1 + person2).toLowerCase().split('').sort().join('');
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            hash = ((hash << 5) - hash) + combined.charCodeAt(i);
            hash = hash & hash;
        }
        const percentage = Math.abs(hash % 101);
        
        let result;
        let emoji;
        if (percentage >= 80) {
            result = "≡ƒÆÿ Soulmates!";
            emoji = "≡ƒÆÿ";
        } else if (percentage >= 60) {
            result = "≡ƒÆò Great match!";
            emoji = "≡ƒÆò";
        } else if (percentage >= 40) {
            result = "≡ƒÆ£ Could work!";
            emoji = "≡ƒÆ£";
        } else if (percentage >= 20) {
            result = "≡ƒñö Hmm...";
            emoji = "≡ƒñö";
        } else {
            result = "≡ƒÆö Run away!";
            emoji = "≡ƒÆö";
        }
        
        const bar = "Γ¥ñ∩╕Å".repeat(Math.floor(percentage / 10)) + "≡ƒûñ".repeat(10 - Math.floor(percentage / 10));
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `≡ƒÆò Love Ship\n\n${person1} ≡ƒÆò ${person2}\n\n${bar}\n\nΓ¥ñ∩╕Å ${percentage}%\n\n${result}`,
            contextInfo
        }, { quoted: msg });
    }
};
