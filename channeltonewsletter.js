const fs = require('fs');
const path = require('path');

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCFEZv60eBdlqXqQz20';

const msgs = [
    '📰 *NEVER MISS AN UPDATE* 📰',
    '🌟 *YOUR DAILY DOSE* 🌟',
    '💌 *EXCLUSIVE CONTENT* 💌'
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
                text: getRandom(msgs) + '\n\n✨ *WHATSAPP CHANNEL TO NEWSLETTER* ✨\n\n━━━━━━━━━━━━━━━━━━━━━\n\n📌 Current Channel: ' + CHANNEL_LINK + '\n\n🔄 CONVERT TO NEWSLETTER:\n\n1️⃣ Subscribe to channel\n2️⃣ Enable notifications\n3️⃣ Get daily updates\n\n━━━━━━━━━━━━━━━━━━━━━\n\n💡 Send the channel link to convert!',
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
            text: getRandom(msgs) + '\n\n✨ *CHANNEL CONVERTED TO NEWSLETTER* ✨\n\n━━━━━━━━━━━━━━━━━━━━━\n\n📋 Newsletter ID: ' + extractedCode.substring(0, 8).toUpperCase() + '\n\n🔗 Original Channel:\nhttps://whatsapp.com/channel/' + extractedCode + '\n\n📧 Newsletter Version:\n' + newsletterVersion + '\n\n━━━━━━━━━━━━━━━━━━━━━\n\n✅ Benefits:\n• Direct notifications\n• Easy sharing\n• Newsletter format',
            quoted: msg
        });
    }
};