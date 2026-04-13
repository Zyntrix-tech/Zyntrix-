const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "logo",
    aliases: ["make logo", "brand", "text art"],
    description: "Create logos and text designs",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // Check for search query
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ£¿ *Logo Generator*\n\n` +
                      `ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n` +
                      `*Usage:* !logo <text>\n\n` +
                      `*Styles:*\n` +
                      `ΓÇó !logo <text> --retro\n` +
                      `ΓÇó !logo <text> --modern\n` +
                      `ΓÇó !logo <text> --gaming\n` +
                      `ΓÇó !logo <text> --neon\n` +
                      `ΓÇó !logo <text> --metal\n\n` +
                      `*Examples:*\n` +
                      `ΓÇó !logo NEXORA\n` +
                      `ΓÇó !logo MyBrand --gaming\n` +
                      `ΓÇó !logo Nexora --neon`,
                contextInfo 
            }, { quoted: msg });
            return;
        }

        let text = args.join(' ');
        let style = 'default';

        // Check for style flags
        if (text.includes('--retro')) {
            style = 'retro';
            text = text.replace(/--retro/g, '').trim();
        } else if (text.includes('--modern')) {
            style = 'modern';
            text = text.replace(/--modern/g, '').trim();
        } else if (text.includes('--gaming') || text.includes('--game')) {
            style = 'gaming';
            text = text.replace(/--gaming|--game/g, '').trim();
        } else if (text.includes('--neon')) {
            style = 'neon';
            text = text.replace(/--neon/g, '').trim();
        } else if (text.includes('--metal')) {
            style = 'metal';
            text = text.replace(/--metal/g, '').trim();
        }

        if (!text) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "Γ£¿ Please provide text for the logo!", 
                contextInfo 
            }, { quoted: msg });
            return;
        }

        if (text.length > 20) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "Γ¥î Text too long! Please use 20 characters or less.", 
                contextInfo 
            }, { quoted: msg });
            return;
        }

        try {
            // Send typing indicator
            await sock.sendPresenceUpdate('composing', from);
            
            // Loading reaction
            await sock.sendMessage(from, { react: { text: 'Γ£¿', key: msg.key } });

            // Generate logo using different ASCII art styles
            const logos = {
                retro: `
ΓòöΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòù
Γòæ      ${text.toUpperCase()}       Γòæ
Γòæ     πÇÉ Retro Style πÇæ    Γòæ
ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥`,
                modern: `
ΓöîΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÉ
Γöé      ${text.toUpperCase()}       Γöé
Γöé     Γùç Modern Style Γùç    Γöé
ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ`,
                gaming: `
ΓûæΓûÆΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûÆΓûæ
ΓûÆΓûê      ${text.toUpperCase()}       ΓûêΓûÆ
ΓûÆΓûê     πÇÉ Gaming Style πÇæ  ΓûêΓûÆ
ΓûæΓûÆΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûÆΓûæ`,
                neon: `
ΓùêΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓùê
Γöâ  ${text.toUpperCase().padEnd(14)}  Γöâ
Γöâ  Γû╕ Neon Style Γùé   Γöâ
ΓùêΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓùê`,
                metal: `
ΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûô
ΓûôΓûô      ${text.toUpperCase()}       ΓûôΓûô
ΓûôΓûô     ΓòÉΓòÉ Metal ΓòÉΓòÉ     ΓûôΓûô
ΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûôΓûô`,
                default: `
Γò¡ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓò«
Γöé     ${text.toUpperCase()}      Γöé
Γöé    Γùå Default Style Γùå   Γöé
Γò░ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓò»`
            };

            const logo = logos[style] || logos.default;

            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ£¿ *Logo Generated*\n\n${logo}\n\nStyle: ${style}`, 
                contextInfo 
            }, { quoted: msg });
            
            // Success reaction
            await sock.sendMessage(from, { react: { text: 'Γ£à', key: msg.key } });
            
        } catch (err) {
            console.error('Logo error:', err);
            await sock.sendMessage(from, { react: { text: 'Γ¥î', key: msg.key } });
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "Γ¥î Failed to generate logo.", 
                contextInfo 
            }, { quoted: msg });
        }
    }
}
