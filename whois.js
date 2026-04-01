const { createContextWithButtons } = require('./_helpers');

module.exports = {
    name: "whois",
    aliases: ["domain", "lookup"],
    description: "Get domain whois information",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        if (args.length < 1) {
            const contextInfo = createContextWithButtons();
            await sock.sendMessage(from, { 
                text: `🔍 *DOMAIN WHOIS LOOKUP*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !whois <domain>\n\nExample:\n!whois google.com\n!whois github.com\n\nGets domain registration info!`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        let domain = args[0].replace(/https?:\/\//, '').replace(/www\./, '');
        
        // Basic validation
        if (!domain.includes('.')) {
            await sock.sendMessage(from, { 
                text: "❌ Please provide a valid domain (e.g., google.com)!" 
            }, { quoted: msg });
            return;
        }

        await sock.sendMessage(from, { 
            react: { text: '🔍', key: msg.key } 
        });

        // Simulate lookup
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate fake whois data
        const registrars = ['GoDaddy', 'NameCheap', 'Cloudflare', 'AWS', 'Google Domains'];
        const registrar = registrars[Math.floor(Math.random() * registrars.length)];
        
        const createdDate = new Date(Date.now() - Math.random() * 10 * 365 * 24 * 60 * 60 * 1000);
        const expiryDate = new Date(Date.now() + Math.random() * 2 * 365 * 24 * 60 * 60 * 1000);
        
        const contextInfo = createContextWithButtons();
        
        await sock.sendMessage(from, { 
            text: `🔍 *WHOIS LOOKUP - ${domain}*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n📛 *Domain:* ${domain}\n\n🏢 *Registrar:* ${registrar}\n\n📅 *Created:* ${createdDate.toLocaleDateString()}\n\n📅 *Expires:* ${expiryDate.toLocaleDateString()}\n\n🌍 *Registrant Country:* Nigeria\n\n📡 *Name Servers:*\n• ns1.${domain}\n• ns2.${domain}\n\n✅ *Status:* Active\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ *Note:* This is simulated data for fun!`,
            contextInfo 
        }, { quoted: msg });

        await sock.sendMessage(from, { 
            react: { text: '✅', key: msg.key } 
        });
    }
};