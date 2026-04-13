const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "hack3",
    aliases: ["hax3", "ghack3", "superhack"],

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        
        // Check if it's a group
        if (!isGroup) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: "ΓÜá∩╕Å This command only works in groups!",
                contextInfo
            }, { quoted: msg });
            return;
        }

        const target = args[0] ? args.join(" ") : "this chat";
        
        const hackSteps = [
            "≡ƒöÉ Establishing secure connection...",
            "≡ƒöÉ Bypassing WhatsApp encryption...",
            "≡ƒöÉ Accessing Meta servers...",
            "≡ƒöÉ Injecting SQL payload...",
            "≡ƒöÉ Brute-forcing password...",
            "≡ƒöÉ Installing keylogger...",
            "≡ƒöÉ Downloading contacts...",
            "≡ƒöÉ Accessing camera...",
            "≡ƒöÉ Reading messages...",
            "≡ƒöÉ Finalizing access..."
        ];

        const contextInfo = createForwardedContext();
        
        // Send hacking steps with progress
        for (let i = 0; i < hackSteps.length; i++) {
            const progress = Math.round(((i + 1) / hackSteps.length) * 100);
            const bar = "Γûê".repeat(Math.floor(progress / 5)) + "Γûæ".repeat(20 - Math.floor(progress / 5));
            
            await sock.sendMessage(from, {
                text: `${hackSteps[i]}\n\n[${bar}] ${progress}%`,
                contextInfo
            }, { quoted: msg });
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Final hack message
        const finalMessages = [
            `≡ƒÄ» TARGET ACQUIRED: ${target}\n\n≡ƒÆÇ SYSTEM STATUS: COMPROMISED\nΓ£à Access: ROOT\n≡ƒöô Encryption: BYPASSED\n≡ƒôè Data: DOWNLOADED\n≡ƒùæ∩╕Å Evidence: WIPED`,
            `≡ƒöÑ MISSION ACCOMPLISHED!\n\nTarget has been successfully hacked.\nAll data has been extracted.\nBackdoor installed.\nLeaving no trace...`,
            `≡ƒÅå HACK COMPLETE!\n\n≡ƒô▒ Full device access granted\n≡ƒÆ░ Bank accounts compromised\n≡ƒô╕ Private data exposed\nΓ£à Target is now fully owned`
        ];
        
        for (const finalMsg of finalMessages) {
            await sock.sendMessage(from, {
                text: finalMsg,
                contextInfo
            }, { quoted: msg });
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }
};
