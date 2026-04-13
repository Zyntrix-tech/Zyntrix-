const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "ipinfo",
    aliases: ["ip", "myip"],
    description: "Get IP address information",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        await sock.sendMessage(from, { react: { text: '≡ƒîÉ', key: msg.key } });
        
        try {
            const response = await axios.get('https://ipapi.co/json/');
            
            const data = response.data;
            
            const text = `≡ƒîÉ *IP INFORMATION*\n\n` +
                         `≡ƒôì IP Address: *${data.ip}*\n` +
                         `≡ƒîì Country: ${data.country_name} ${data.country_flag_emoji}\n` +
                         `≡ƒù║∩╕Å Region: ${data.region}\n` +
                         `≡ƒÅÖ∩╕Å City: ${data.city}\n` +
                         `≡ƒô« Postal: ${data.postal}\n` +
                         `≡ƒîÉ ISP: ${data.org}\n` +
                         `≡ƒòÉ Timezone: ${data.timezone}\n` +
                         `≡ƒôÅ Coordinates: ${data.latitude}, ${data.longitude}`;
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { text: text, contextInfo }, { quoted: msg });
            
        } catch (err) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ¥î Could not fetch IP information.`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
