const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "rate",
    aliases: ["score", "rating"],
    description: "Rate anything from 0-100",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        if (args.length === 0) {
            // Rate the person themselves
            const rating = Math.floor(Math.random() * 101);
            let reaction;
            
            if (rating >= 90) reaction = "≡ƒÅå LEGENDARY!";
            else if (rating >= 75) reaction = "Γ¡É AMAZING!";
            else if (rating >= 50) reaction = "≡ƒæì GOOD!";
            else if (rating >= 25) reaction = "≡ƒÿà NEEDS WORK";
            else reaction = "≡ƒÆÇ OH NO...";
            
            await sock.sendMessage(from, { 
                text: `≡ƒôè *RATING FOR ${sender}:*\n\n≡ƒÄ» *${rating}/100*\n\n${reaction}`,
                contextInfo 
            }, { quoted: msg });
        } else {
            // Rate whatever they input
            const thing = args.join(" ");
            const rating = Math.floor(Math.random() * 101);
            let reaction;
            
            if (rating >= 90) reaction = "≡ƒöÑ PERFECT!";
            else if (rating >= 75) reaction = "Γ£¿ GREAT!";
            else if (rating >= 50) reaction = "≡ƒæì DECENT";
            else if (rating >= 25) reaction = "≡ƒñö MEH...";
            else reaction = "≡ƒÆÇ YIKES!";
            
            await sock.sendMessage(from, { 
                text: `≡ƒôè *RATING FOR "${thing}":*\n\n≡ƒÄ» *${rating}/100*\n\n${reaction}`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
