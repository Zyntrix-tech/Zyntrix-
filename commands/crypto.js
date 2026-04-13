const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "crypto",
    aliases: ["bitcoin", "btc", "eth"],
    description: "Get cryptocurrency prices",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        await sock.sendMessage(from, { react: { text: '≡ƒÆ░', key: msg.key } });
        
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
            
            const coins = response.data;
            let text = `≡ƒÆ░ *CRYPTOCURRENCY PRICES*\n\n`;
            
            coins.forEach((coin, i) => {
                const change = coin.price_change_percentage_24h;
                const isUp = change >= 0;
                text += `${i + 1}. *${coin.symbol.toUpperCase()}* $${coin.current_price.toLocaleString()}\n`;
                text += `   ${isUp ? 'Γû▓' : 'Γû╝'} ${Math.abs(change).toFixed(2)}%\n\n`;
            });
            
            text += `≡ƒÆí Use !crypto <coin> for specific coin`;
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { text: text, contextInfo }, { quoted: msg });
            
        } catch (err) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ¥î Could not fetch crypto prices. Try again later.`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
