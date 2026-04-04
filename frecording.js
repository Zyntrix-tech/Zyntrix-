const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'frecording',
    aliases: ['fakerecording', 'setrecording'],
    description: 'Enable/disable fake recording indicator for incoming messages',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        
        // Check if sender is owner
        const isOwner = global.ownerJid && String(sender).split('@')[0] === String(global.ownerJid).split('@')[0];
        
        if (!isOwner) {
            await sock.sendMessage(from, { 
                text: "🎤 Only the bot owner can configure fake recording!" 
            }, { quoted: msg });
            return;
        }

        // Initialize if not exists
        global.fakeRecordingSettings = global.fakeRecordingSettings || {};
        
        const action = args[0]?.toLowerCase();
        
        if (action === 'on' || action === 'enable' || action === 'true') {
            global.fakeRecordingSettings.enabled = true;
            global.fakeRecordingSettings.mode = 'recording';
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "🎤 *FAKE RECORDING ENABLED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Fake recording indicator is now ACTIVE!\n\n📝 When someone sends you a message, it will appear as if you are recording a voice note.\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Use !frecording off to disable.",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        if (action === 'off' || action === 'disable' || action === 'false') {
            global.fakeRecordingSettings.enabled = false;
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "🎤 *FAKE RECORDING DISABLED*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✅ Fake recording indicator is now INACTIVE!\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Use !frecording on to enable.",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        // Show current status
        const isEnabled = global.fakeRecordingSettings.enabled;
        const status = isEnabled ? '✅ ACTIVE' : '❌ INACTIVE';
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, { 
            text: `🎤 *FAKE RECORDING STATUS*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n📊 Current Status: ${status}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n💡 Usage:\n!frecording on - Enable fake recording\n!frecording off - Disable fake recording`,
            contextInfo 
        }, { quoted: msg });
    }
};