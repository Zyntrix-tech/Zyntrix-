const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "stock",
    aliases: ["stocks", "share", "shares"],
    description: "Get stock price information",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `≡ƒôê *STOCK MARKET*\n\nUsage: !stock <symbol>\n\nExample:\n!stock AAPL\n!stock TSLA\n!stock GOOGL`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const symbol = args[0].toUpperCase();
        
        await sock.sendMessage(from, { react: { text: '≡ƒôê', key: msg.key } });
        
        try {
            const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
            
            const result = response.data.chart.result[0];
            const meta = result.meta;
            const quote = result.indicators.quote[0];
            
            const price = meta.regularMarketPrice;
            const prevClose = meta.chartPreviousClose || meta.previousClose;
            const change = price - prevClose;
            const changePercent = ((change / prevClose) * 100).toFixed(2);
            const isUp = change >= 0;
            
            const text = `≡ƒôê *${meta.symbol}*\n\n` +
                        `≡ƒÆ╡ *Price:* $${price.toFixed(2)}\n` +
                        `≡ƒôè *Change:* ${isUp ? 'Γû▓' : 'Γû╝'} $${Math.abs(change).toFixed(2)} (${isUp ? '+' : ''}${changePercent}%)\n` +
                        `≡ƒÅ¢∩╕Å *Previous Close:* $${prevClose?.toFixed(2) || 'N/A'}\n` +
                        `≡ƒôà *Market:* ${meta.exchangeName}\n` +
                        `ΓÅ░ *Session:* ${meta.marketState || 'OPEN'}`;
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { text: text, contextInfo }, { quoted: msg });
            
        } catch (err) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ¥î Could not find stock "${symbol}".\n\nPlease check the symbol and try again.`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
