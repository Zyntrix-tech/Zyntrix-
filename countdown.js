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
                text: `⏱️ *Countdown Timer*\n\n*Usage:* !countdown <seconds>\n\n*Examples:*\n• !countdown 10\n• !countdown 60\n• !countdown 5`,
                contextInfo
            }, { quoted: msg });
            return;
        }

        if (seconds > 300) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: "⏱️ Maximum countdown is 300 seconds (5 minutes)",
                contextInfo
            }, { quoted: msg });
            return;
        }

        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `⏱️ *Countdown Started!* ${seconds} seconds...`,
            contextInfo
        }, { quoted: msg });

        const interval = setInterval(async () => {
            seconds--;
            if (seconds > 0) {
                await sock.sendMessage(from, {
                    text: `⏱️ ${seconds}...`,
                    contextInfo
                });
            } else {
                clearInterval(interval);
                await sock.sendMessage(from, {
                    text: `🔔 *TIME'S UP!* ⏰`,
                    contextInfo
                });
                await sock.sendMessage(from, { react: { text: '🔔', key: msg.key } });
            }
        }, 1000);
    }
};
