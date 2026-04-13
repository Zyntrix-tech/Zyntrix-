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
                text: `≡ƒöì *DOMAIN WHOIS LOOKUP*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !whois <domain>\n\nExample:\n!whois google.com\n!whois github.com\n\nGets domain registration info!`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        let domain = args[0].replace(/https?:\/\//, '').replace(/www\./, '');
        
        // Basic validation
        if (!domain.includes('.')) {
            await sock.sendMessage(from, { 
                text: "Γ¥î Please provide a valid domain (e.g., google.com)!" 
            }, { quoted: msg });
            return;
        }

        await sock.sendMessage(from, { 
            react: { text: '≡ƒöì', key: msg.key } 
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
            text: `≡ƒöì *WHOIS LOOKUP - ${domain}*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒô¢ *Domain:* ${domain}\n\n≡ƒÅó *Registrar:* ${registrar}\n\n≡ƒôà *Created:* ${createdDate.toLocaleDateString()}\n\n≡ƒôà *Expires:* ${expiryDate.toLocaleDateString()}\n\n≡ƒîì *Registrant Country:* Nigeria\n\n≡ƒôí *Name Servers:*\nΓÇó ns1.${domain}\nΓÇó ns2.${domain}\n\nΓ£à *Status:* Active\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓÜá∩╕Å *Note:* This is simulated data for fun!`,
            contextInfo 
        }, { quoted: msg });

        await sock.sendMessage(from, { 
            react: { text: 'Γ£à', key: msg.key } 
        });
    }
};
