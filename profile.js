const { createContextWithButtons } = require('./_helpers');

module.exports = {
    name: "profile",
    aliases: ["card", "me"],
    description: "Generate your profile card",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || "User";
        
        // Get user info from message
        const userJid = sender;
        const userNumber = userJid.split('@')[0];
        
        // Generate random stats for fun
        const level = Math.floor(Math.random() * 50) + 1;
        const xp = Math.floor(Math.random() * 1000);
        const messages = Math.floor(Math.random() * 5000);
        const rank = ["Newbie", "Member", "Regular", "VIP", "Elite", "Legend"][Math.floor(Math.random() * 6)];
        
        const contextInfo = createContextWithButtons();
        
        await sock.sendMessage(from, { 
            text: `👤 *YOUR PROFILE CARD*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                  `📛 *Name:* ${pushName}\n\n` +
                  `📱 *Number:* ${userNumber}\n\n` +
                  `⭐ *Level:* ${level}\n\n` +
                  `💫 *XP:* ${xp} / ${level * 100}\n\n` +
                  `💬 *Messages:* ${messages}\n\n` +
                  `🏆 *Rank:* ${rank}\n\n` +
                  `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                  `💡 Use !rank to see server rankings!`,
            contextInfo 
        }, { quoted: msg });
    }
};