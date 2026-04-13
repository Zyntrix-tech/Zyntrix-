const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "ud",
    aliases: ["urbandictionary"],
    description: "Search Urban Dictionary",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "≡ƒôû *URBAN DICTIONARY*\n\nUsage: !ud <term>\n\nExample:\n!ud no cap\n!ud bet",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const term = args.join(' ');
        
        await sock.sendMessage(from, { react: { text: '≡ƒôû', key: msg.key } });
        
        try {
            const response = await axios.get("https://api.urbandictionary.com/v0/define?term=" + encodeURIComponent(term));
            
            if (!response.data.list || response.data.list.length === 0) {
                throw new Error('No results');
            }
            
            const def = response.data.list[0];
            
            // Clean up definition and example (remove brackets for better readability)
            const cleanDefinition = def.definition.replace(/\[|\]/g, '');
            const cleanExample = def.example.replace(/\[|\]/g, '');
            
            const text = "≡ƒôû *" + def.word + "*\n\n" +
                         "≡ƒô¥ Definition:\n" + cleanDefinition + "\n\n" +
                         "≡ƒÆí Example:\n" + cleanExample + "\n\n" +
                         "≡ƒæì " + def.thumbs_up + " | ≡ƒæÄ " + def.thumbs_down;
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { text: text, contextInfo }, { quoted: msg });
            
        } catch (err) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "Γ¥î Could not find definition for \"" + term + "\".",
                contextInfo 
            }, { quoted: msg });
        }
    }
};
