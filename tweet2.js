const { createForwardedContext } = require('./_helpers');

// Twitter API configuration - set these in environment variables
const TWITTER_API_KEY = process.env.TWITTER_API_KEY || '';
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || '';
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN || '';
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET || '';
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || '';

module.exports = {
    name: 'tweet2',
    aliases: ['twitter2', 'twit', 'x'],
    description: 'Post a tweet via Twitter API (requires API credentials)',

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

        const tweetContent = args.join(' ').trim();
        
        if (!tweetContent) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "🐦 *POST TWEET (API)*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nUsage: !tweet2 <your_tweet>\n\nExample:\n!tweet2 Hello from WhatsApp! 🐦\n\n⚠️ Requires Twitter API credentials in .env",
                contextInfo 
            }, { quoted: msg });
            return;
        }

        const contextInfo = createForwardedContext();

        // Check if Twitter API credentials are configured
        if (!TWITTER_BEARER_TOKEN) {
            // Simulate posting if no API credentials
            await sock.sendMessage(from, { 
                text: `🐦 *TWEET (SIMULATED)*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ Twitter API not configured.\n\n✅ Your tweet has been recorded (simulated):\n\n📝 "${tweetContent}"\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n🕐 Time: ${new Date().toLocaleString()}\n\n💡 To post real tweets, add these to .env:\nTWITTER_BEARER_TOKEN=your_token`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        try {
            // Post to Twitter API
            const response = await fetch('https://api.twitter.com/2/tweets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: tweetContent })
            });

            if (response.ok) {
                const data = await response.json();
                await sock.sendMessage(from, { 
                    text: `🐦 *TWEET POSTED SUCCESSFULLY!*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Your tweet has been posted to Twitter!\n\n📝 "${tweetContent}"\n\n🔗 https://twitter.com/user/status/${data.data.id}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n🕐 Time: ${new Date().toLocaleString()}`,
                    contextInfo 
                }, { quoted: msg });
            } else {
                throw new Error(`Twitter API error: ${response.status}`);
            }
        } catch (err) {
            console.error('Tweet2 command error:', err);
            await sock.sendMessage(from, { 
                text: `🐦 *TWEET FAILED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n❌ Failed to post tweet: ${err.message}\n\n📝 Your tweet was:\n"${tweetContent}"\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Check your Twitter API credentials in .env`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};