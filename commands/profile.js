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
            text: `≡ƒæñ *YOUR PROFILE CARD*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n` +
                  `≡ƒô¢ *Name:* ${pushName}\n\n` +
                  `≡ƒô▒ *Number:* ${userNumber}\n\n` +
                  `Γ¡É *Level:* ${level}\n\n` +
                  `≡ƒÆ½ *XP:* ${xp} / ${level * 100}\n\n` +
                  `≡ƒÆ¼ *Messages:* ${messages}\n\n` +
                  `≡ƒÅå *Rank:* ${rank}\n\n` +
                  `ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n` +
                  `≡ƒÆí Use !rank to see server rankings!`,
            contextInfo 
        }, { quoted: msg });
    }
};
