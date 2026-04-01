const { createContextWithButtons } = require('./_helpers');
const axios = require('axios');

module.exports = {
    name: "tracer",
    aliases: ["track", "locate", "find"],
    description: "Trace a phone number to get location info",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        if (args.length < 1) {
            const contextInfo = createContextWithButtons();
            await sock.sendMessage(from, { 
                text: `📍 *PHONE TRACER*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !tracer <phone number>\n\nExample: !tracer 2348012345678\n\n⚠️ This is for educational purposes only!`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        const phone = args[0].replace(/[^0-9]/g, '');
        
        if (phone.length < 10) {
            await sock.sendMessage(from, { 
                text: "❌ Please provide a valid phone number with country code!" 
            }, { quoted: msg });
            return;
        }

        // Send processing message
        await sock.sendMessage(from, { 
            react: { text: '🔍', key: msg.key } 
        });

        const loadingMsg = await sock.sendMessage(from, { 
            text: `📍 *TRACING PHONE...*\n\n🔎 Analyzing: +${phone}\n\nPlease wait...` 
        }, { quoted: msg });

        // Simulate tracing (in real scenario, this would call an API)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate fake trace result for fun
        const countries = [
            { code: 'NG', name: 'Nigeria', city: 'Lagos', provider: 'MTN' },
            { code: 'US', name: 'United States', city: 'New York', provider: 'AT&T' },
            { code: 'GB', name: 'United Kingdom', city: 'London', provider: 'O2' },
            { code: 'IN', name: 'India', city: 'Mumbai', provider: 'Jio' },
            { code: 'BR', name: 'Brazil', city: 'São Paulo', provider: 'Vivo' }
        ];

        const result = countries[Math.floor(Math.random() * countries.length)];
        
        const contextInfo = createContextWithButtons();
        await sock.sendMessage(from, { 
            text: `📍 *PHONE TRACE COMPLETE*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n📱 *Phone:* +${phone}\n\n🌍 *Country:* ${result.name} (${result.code})\n\n🏙️ *City:* ${result.city}\n\n📡 *Provider:* ${result.provider}\n\n⏰ *Timezone:* UTC+1\n\n📊 *Status:* Active\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ *Disclaimer:* This is just a simulation for fun!`,
            contextInfo 
        }, { quoted: msg });

        await sock.sendMessage(from, { 
            react: { text: '✅', key: msg.key } 
        });
    }
};