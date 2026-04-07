const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'ftyping',
    aliases: ['fake typingset', 'settyping'],
    description: 'Enable/disable fake typing indicator for incoming messages',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Check if sender is owner
        const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
        
        if (!isOwner) {
            await sock.sendMessage(from, { 
                text: "Γî¿∩╕Å Only the bot owner can configure fake typing!" 
            }, { quoted: msg });
            return;
        }

        // Initialize if not exists
        global.fakeTypingSettings = global.fakeTypingSettings || {};
        
        const action = args[0]?.toLowerCase();
        
        if (action === 'on' || action === 'enable' || action === 'true') {
            global.fakeTypingSettings.enabled = true;
            global.fakeTypingSettings.mode = 'typing';
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "Γî¿∩╕Å *FAKE TYPING ENABLED*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓ£à Fake typing indicator is now ACTIVE!\n\n≡ƒô¥ When someone sends you a message, it will appear as if you are typing.\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÆí Use !ftyping off to disable.",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        if (action === 'off' || action === 'disable' || action === 'false') {
            global.fakeTypingSettings.enabled = false;
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "Γî¿∩╕Å *FAKE TYPING DISABLED*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓ£à Fake typing indicator is now INACTIVE!\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÆí Use !ftyping on to enable.",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        // Show current status
        const isEnabled = global.fakeTypingSettings.enabled;
        const status = isEnabled ? 'Γ£à ACTIVE' : 'Γ¥î INACTIVE';
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, { 
            text: `Γî¿∩╕Å *FAKE TYPING STATUS*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒôè Current Status: ${status}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÆí Usage:\n!ftyping on - Enable fake typing\n!ftyping off - Disable fake typing`,
            contextInfo 
        }, { quoted: msg });
    }
};
