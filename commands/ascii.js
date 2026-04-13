const { createForwardedContext } = require('./_helpers');

const asciiArt = {
    shrug: `┬»\\_(πâä)_/┬»`,
    tableflip: `(Γò»┬░Γûí┬░)Γò»∩╕╡ Γö╗ΓöüΓö╗`,
    unflip: 'Γö¼ΓöÇΓö¼πâÄ( ┬║ _ ┬║πâÄ)',
    lenny: '( ═í┬░ ═£╩û ═í┬░)',
    disapprove: 'α▓á_α▓á',
    bear: '╩òΓÇóß┤ÑΓÇó╩ö',
    sparkles: 'Γ£º∩╜Ñ∩╛ƒ: *Γ£º∩╜Ñ∩╛ƒ:*',
    heart: 'ΓÖÑΓÇ┐ΓÖÑ',
    cry: '(α▓Ñ∩╣Åα▓Ñ)',
    cool: '( ╠äπâ╝ ╠ä)',
    trippy: '(Γò¡α▓░_ΓÇó╠ü)',
    confused: '(ΓùÄ_ΓùÄ;)',
    angry: '(πâÄα▓áτ¢èα▓á)πâÄσ╜íΓö╗ΓöüΓö╗',
    shrug2: 'ΓöÉ(┬┤╨┤`)Γöî',
    magic: '(πâÄ┬░ΓêÇ┬░)πâÄΓîÆπâ╗*:.πÇé',
    fight: '(α╕ç' + "'" + `_')α╕ç`,
    sad: '(ΓòÑ_ΓòÑ)',
    yay: '(ΓùòΓÇ┐Γùò)'
};

module.exports = {
    name: "ascii",
    aliases: ["textface", "face", "emoticon"],
    description: "Get ASCII text faces",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        const faces = Object.keys(asciiArt).map(f => `!ascii ${f}`).join('\n');
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `ASCII *TEXT FACES*\n\nAvailable faces:\n\n${faces}`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const face = args[0].toLowerCase();
        
        if (asciiArt[face]) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: asciiArt[face],
                contextInfo 
            }, { quoted: msg });
        } else {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Face not found. Use !ascii without args to see available faces.`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
