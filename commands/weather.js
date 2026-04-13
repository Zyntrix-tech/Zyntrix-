const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "weather",
    aliases: ["wea", "wttr"],
    description: "Get weather information for a city",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "≡ƒîñ∩╕Å Weather Checker\\n\\nUsage: !weather <city>\\n\\nExample: !weather Lagos\\n!weather London UK\\n!weather New York",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const city = args.join(' ');
        
        try {
            // Send reaction
            await sock.sendMessage(from, { react: { text: '≡ƒîñ∩╕Å', key: msg.key } });
            
            // Using wttr.in - free weather service
            const weatherUrl = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
            const response = await axios.get(weatherUrl);
            
            const current = response.data.current_condition[0];
            const location = response.data.nearest_area[0]?.areaName[0]?.value || city;
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `≡ƒîñ∩╕Å Weather for ${location}:\n\n` +
                      `≡ƒîí∩╕Å Temperature: ${current.temp_C}┬░C (${current.temp_F}┬░F)\n` +
                      `≡ƒÆº Humidity: ${current.humidity}%\n` +
                      `≡ƒî¼∩╕Å Wind: ${current.windspeedKmph} km/h\n` +
                      `Γÿü∩╕Å Condition: ${current.weatherDesc[0].value}\n` +
                      `≡ƒæü∩╕Å Visibility: ${current.visibility} km\n` +
                      `≡ƒîí∩╕Å Feels like: ${current.FeelsLikeC}┬░C`,
                contextInfo 
            }, { quoted: msg });
            
        } catch (err) {
            console.error("Weather error:", err);
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "Γ¥î Could not get weather for that location.\\n\\nPlease check the city name and try again.",
                contextInfo 
            }, { quoted: msg });
        }
    }
};
