const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "marry",
    aliases: ["proposal", "wedding", "propose"],
    description: "Marriage proposal calculator",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        if (args.length < 1) {
            await sock.sendMessage(from, { 
                text: `≡ƒÆì *MARRIAGE CALCULATOR*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !marry <name>\n\nExample: !marry Sarah\n\n≡ƒÆò Will you say yes?`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const partnerName = args.join(" ");
        
        // Generate a "calculated" result
        const nameSum = (partnerName + sender).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const percentage = (nameSum % 101);
        
        let result;
        let emoji;
        
        if (percentage >= 90) {
            result = "≡ƒÆì SOULMATES! Get married ASAP!";
            emoji = "≡ƒæ╝";
        } else if (percentage >= 75) {
            result = "≡ƒÆò PERFECT MATCH! High chances!";
            emoji = "≡ƒÆò";
        } else if (percentage >= 50) {
            result = "≡ƒæì GOOD CHANCE! Try your luck!";
            emoji = "≡ƒæì";
        } else if (percentage >= 25) {
            result = "≡ƒñö Needs work, but never say never!";
            emoji = "≡ƒñö";
        } else {
            result = "≡ƒÆÇ Friendzone... or maybe not!";
            emoji = "≡ƒÆÇ";
        }
        
        await sock.sendMessage(from, { 
            text: `≡ƒÆì *MARRIAGE CALCULATOR*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒæñ *${sender}* + *${partnerName}*\n\n≡ƒÆû Success Rate: *${percentage}%*\n\n${emoji} ${result}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓÜá∩╕Å Just for fun! Don't propose based on this! ≡ƒÿà`,
            contextInfo 
        }, { quoted: msg });
    }
};
