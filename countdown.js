const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "countdown",
    aliases: ["timer", "count"],
    description: "Start a countdown timer",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        let seconds = parseInt(args[0]);
        
        if (!seconds || isNaN(seconds)) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: `ΓÅ▒∩╕Å *Countdown Timer*\n\n*Usage:* !countdown <seconds>\n\n*Examples:*\nΓÇó !countdown 10\nΓÇó !countdown 60\nΓÇó !countdown 5`,
                contextInfo
            }, { quoted: msg });
            return;
        }

        if (seconds > 300) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: "ΓÅ▒∩╕Å Maximum countdown is 300 seconds (5 minutes)",
                contextInfo
            }, { quoted: msg });
            return;
        }

        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `ΓÅ▒∩╕Å *Countdown Started!* ${seconds} seconds...`,
            contextInfo
        }, { quoted: msg });

        const interval = setInterval(async () => {
            seconds--;
            if (seconds > 0) {
                await sock.sendMessage(from, {
                    text: `ΓÅ▒∩╕Å ${seconds}...`,
                    contextInfo
                });
            } else {
                clearInterval(interval);
                await sock.sendMessage(from, {
                    text: `≡ƒöö *TIME'S UP!* ΓÅ░`,
                    contextInfo
                });
                await sock.sendMessage(from, { react: { text: '≡ƒöö', key: msg.key } });
            }
        }, 1000);
    }
};
