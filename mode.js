module.exports = {
    name: "mode",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const ownerJid = global.ownerJid;

        // Check if owner is set - if not, prompt to set owner
        if (!ownerJid) {
            await sock.sendMessage(from, {
                text: "🔐 *SET OWNER FIRST*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n⚠️ No owner has been set for this bot!\n\n📝 Please set the owner using:\n!setowner <your_number>\n\nExample: !setowner 2348012345678\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 The owner will have access to private mode and all owner commands."
            }, { quoted: msg });
            return;
        }

        // Check if sender is owner
        const senderNum = String(sender).split('@')[0];
        const ownerNum = String(ownerJid).split('@')[0];
        const isOwner = senderNum === ownerNum;

        if (!isOwner && !msg.key.fromMe) {
            // Silently ignore - don't respond to non-owners
            return;
        }

        if (args.length === 0) {
            const currentMode = global.botMode || "public";
            await sock.sendMessage(from, {
                text: `📊 *CURRENT MODE*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\nCurrent bot mode: *${currentMode.toUpperCase()}*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Change mode:\n!mode public - Everyone can use commands\n!mode private - Only owner can use commands`
            }, { quoted: msg });
            return;
        }

        const newMode = args[0].toLowerCase();
        if (newMode !== "public" && newMode !== "private") {
            // Silently ignore invalid mode - no error message
            return;
        }

        global.botMode = newMode;

        if (newMode === "private") {
            await sock.sendMessage(from, {
                text: "🔒 *PRIVATE MODE ACTIVATED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Bot is now set to *Private Mode*\n\n🔐 Only the owner can use commands\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Use !mode public to allow everyone"
            }, { quoted: msg });
        } else {
            await sock.sendMessage(from, {
                text: "✅ *PUBLIC MODE ACTIVATED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Bot is now set to *Public Mode*\n\n🌍 Everyone can use commands\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Use !mode private to restrict to owner only"
            }, { quoted: msg });
        }
    }
};
