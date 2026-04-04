const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'tweet',
    aliases: ['twitter', 'posttweet', 'xpost'],
    description: 'Post a tweet (simulated message)',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Check if sender is owner
        const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
        
        if (!isOwner) {
            await sock.sendMessage(from, { 
                text: "🐦 Only the bot owner can post tweets!" 
            }, { quoted: msg });
            return;
        }

        // Get tweet content from args
        const tweetContent = args.join(' ').trim();
        
        if (!tweetContent) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "🐦 *POST TWEET*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !tweet <your_tweet>\n\nExample:\n!tweet Hello from my WhatsApp bot! 🐦\n\nNote: This is a simulated tweet message.",
                contextInfo 
            }, { quoted: msg });
            return;
        }

        // Simulate posting a tweet
        const contextInfo = createForwardedContext();
        
        const tweetMessage = `🐦 *TWEET POSTED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Your tweet has been posted!\n\n📝 *Content:* ${tweetContent}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n🕐 Time: ${new Date().toLocaleString()}\n\n💡 Note: This is a simulated tweet.`;
        
        await sock.sendMessage(from, { 
            text: tweetMessage,
            contextInfo 
        }, { quoted: msg });

        console.log(`Tweet posted by ${sender}: ${tweetContent}`);
    }
};