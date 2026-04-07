const fs = require('fs');
const path = require('path');

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCFEZv60eBdlqXqQz20';

const msgs = [
    '≡ƒô░ *NEVER MISS AN UPDATE* ≡ƒô░',
    '≡ƒîƒ *YOUR DAILY DOSE* ≡ƒîƒ',
    '≡ƒÆî *EXCLUSIVE CONTENT* ≡ƒÆî'
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
    name: 'channeltonewsletter',
    aliases: ['newsletter', 'subscribe'],
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        let channelCode = args[0];
        
        if (!channelCode) {
            await sock.sendMessage(from, {
                text: getRandom(msgs) + '\n\nΓ£¿ *WHATSAPP CHANNEL TO NEWSLETTER* Γ£¿\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒôî Current Channel: ' + CHANNEL_LINK + '\n\n≡ƒöä CONVERT TO NEWSLETTER:\n\n1∩╕ÅΓâú Subscribe to channel\n2∩╕ÅΓâú Enable notifications\n3∩╕ÅΓâú Get daily updates\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÆí Send the channel link to convert!',
                quoted: msg
            });
            return;
        }
        
        let extractedCode = channelCode;
        if (channelCode.includes('whatsapp.com/channel/')) {
            extractedCode = channelCode.split('whatsapp.com/channel/')[1].split(/[\s?&]/)[0];
        }
        
        const newsletterVersion = 'https://whatsapp.com/channel/' + extractedCode + '?isent=true&newsletter=true';
        
        await sock.sendMessage(from, {
            text: getRandom(msgs) + '\n\nΓ£¿ *CHANNEL CONVERTED TO NEWSLETTER* Γ£¿\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒôï Newsletter ID: ' + extractedCode.substring(0, 8).toUpperCase() + '\n\n≡ƒöù Original Channel:\nhttps://whatsapp.com/channel/' + extractedCode + '\n\n≡ƒôº Newsletter Version:\n' + newsletterVersion + '\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓ£à Benefits:\nΓÇó Direct notifications\nΓÇó Easy sharing\nΓÇó Newsletter format',
            quoted: msg
        });
    }
};
