const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "botstats",
    aliases: ["stats", "statistics", "status"],
    description: "Show bot statistics and system info",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        // Calculate uptime
        const uptimeSeconds = global.botStartTime ? Math.floor((Date.now() - global.botStartTime) / 1000) : Math.floor(process.uptime());
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        
        // Get memory usage
        const memUsage = process.memoryUsage();
        const memUsed = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const memTotal = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
        
        // Get command count (approximate)
        const fs = require('fs');
        const path = require('path');
        const commandsDir = path.join(__dirname);
        let commandCount = 0;
        try {
            const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
            commandCount = files.length;
        } catch (e) {
            commandCount = 0;
        }
        
        // Get bot mode
        const mode = global.botMode || "public";
        
        const contextInfo = createForwardedContext();
        
        await sock.sendMessage(from, { 
            text: `≡ƒôè *NEXORA BOT STATISTICS*\n\n` +
                  `ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n` +
                  `≡ƒñû *Bot Info:*\n` +
                  `ΓÇó Name: Zyntrix MDΓÜí\n` +
                  `ΓÇó Mode: ${mode}\n` +
                  `ΓÇó Commands: ${commandCount}+\n\n` +
                  `ΓÅ▒∩╕Å *Uptime:*\n` +
                  `ΓÇó ${days}d ${hours}h ${minutes}m\n\n` +
                  `≡ƒÆ╛ *Memory:*\n` +
                  `ΓÇó Used: ${memUsed} MB\n` +
                  `ΓÇó Total: ${memTotal} MB\n\n` +
                  `≡ƒæÑ *Owner:*\n` +
                  `ΓÇó ${global.ownerJid ? global.ownerJid.split('@')[0] : 'Not set'}\n\n` +
                  `ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n` +
                  `> ≡ƒÜÇ Powered by Γƒª ≡ôå⌐≡ûñì ZYNTRIX ≡ûñì≡ôå¬ Γƒº`,
            contextInfo 
        }, { quoted: msg });
    }
};
