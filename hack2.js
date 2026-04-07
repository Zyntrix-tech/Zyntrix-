const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "hack2",
    aliases: ["glitch", "hack"],
    description: "Fun hacking effect",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        await sock.sendMessage(from, { react: { text: '≡ƒÆ╗', key: msg.key } });
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, { 
            text: "≡ƒÆ╗ *HACKING IN PROGRESS...*\n\nAccessing mainframe...\nBypassing security...",
            contextInfo 
        }, { quoted: msg });
        
        setTimeout(async () => {
            await sock.sendMessage(from, { 
                text: "≡ƒöô *ACCESS GRANTED*\n\nSystem compromised successfully!",
                contextInfo: createForwardedContext()
            });
        }, 2000);
    }
};
