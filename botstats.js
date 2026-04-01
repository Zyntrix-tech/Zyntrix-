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
            text: `📊 *NEXORA BOT STATISTICS*\n\n` +
                  `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                  `🤖 *Bot Info:*\n` +
                  `• Name: Zyntrix MD⚡\n` +
                  `• Mode: ${mode}\n` +
                  `• Commands: ${commandCount}+\n\n` +
                  `⏱️ *Uptime:*\n` +
                  `• ${days}d ${hours}h ${minutes}m\n\n` +
                  `💾 *Memory:*\n` +
                  `• Used: ${memUsed} MB\n` +
                  `• Total: ${memTotal} MB\n\n` +
                  `👥 *Owner:*\n` +
                  `• ${global.ownerJid ? global.ownerJid.split('@')[0] : 'Not set'}\n\n` +
                  `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                  `> 🚀 Powered by ⟦ 𓆩𖤍 ZYNTRIX 𖤍𓆪 ⟧`,
            contextInfo 
        }, { quoted: msg });
    }
};