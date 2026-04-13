const { createContextWithButtons } = require('./_helpers');

// AFK storage
const afkUsers = new Map();

module.exports = {
    name: "afk",
    aliases: ["away", "busy"],
    description: "Set AFK (Away From Keyboard) status",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const pushName = msg.pushName || "User";
        
        // Get reason
        const reason = args.join(" ") || "No reason provided";
        
        // Set AFK
        afkUsers.set(sender, {
            reason: reason,
            time: Date.now(),
            name: pushName
        });
        
        const contextInfo = createContextWithButtons();
        
        await sock.sendMessage(from, { 
            text: `≡ƒÿ┤ *AFK MODE ACTIVATED*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒæñ *User:* ${pushName}\n\n≡ƒô¥ *Reason:* ${reason}\n\nΓÅ░ *Time:* ${new Date().toLocaleTimeString()}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nI'll notify anyone who mentions you!`,
            contextInfo 
        }, { quoted: msg });
    }
};

// Check if user is AFK (exported for other commands to use)
module.exports.isAfk = (jid) => afkUsers.has(jid);
module.exports.getAfkReason = (jid) => afkUsers.get(jid)?.reason;
module.exports.removeAfk = (jid) => afkUsers.delete(jid);
