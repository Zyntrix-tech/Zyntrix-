const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "crush",
    aliases: ["lovecheck", "lovecalc", "crushcalc"],
    description: "Calculate crush compatibility",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        if (args.length < 1) {
            await sock.sendMessage(from, { 
                text: `≡ƒÆò *CRUSH CALCULATOR*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !crush <name>\n\nExample: !crush Sarah\n\nFind out your crush compatibility! ≡ƒÆû`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const crushName = args.join(" ");
        
        // Generate a "calculated" percentage based on names
        const nameSum = (crushName + from).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const percentage = (nameSum % 101);
        
        let result;
        let emoji;
        
        if (percentage >= 90) {
            result = "≡ƒÆì MATCH MADE IN HEAVEN!";
            emoji = "≡ƒæ╝";
        } else if (percentage >= 75) {
            result = "≡ƒöÑ HOT! Strong connection!";
            emoji = "≡ƒöÑ";
        } else if (percentage >= 50) {
            result = "≡ƒÆò Good chances! Go for it!";
            emoji = "≡ƒÆò";
        } else if (percentage >= 25) {
            result = "≡ƒñö Might need more time...";
            emoji = "≡ƒñö";
        } else {
            result = "≡ƒÆÇ Friendzone alert!";
            emoji = "≡ƒÆÇ";
        }
        
        await sock.sendMessage(from, { 
            text: `≡ƒÆò *CRUSH CALCULATOR*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒæñ Your Crush: *${crushName}*\n\n≡ƒÆû Compatibility: *${percentage}%*\n\n${emoji} ${result}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓÜá∩╕Å Just for fun! Don't take it seriously!`,
            contextInfo 
        }, { quoted: msg });
    }
};
