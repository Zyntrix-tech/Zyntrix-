const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "simsimi",
    aliases: ["chat", "talk", "chatbot"],
    description: "Chat with SimSimi AI",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        if (args.length === 0) {
            await sock.sendMessage(from, { 
                text: "≡ƒÆ¼ *SIMSIMI CHATBOT*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !simsimi <message>\n\nExample: !simsimi Hello!",
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const message = args.join(" ");
        
        try {
            await sock.sendPresenceUpdate('composing', from);
            
            const response = await axios.get(`https://simsimi.net/api/µ│íµ│íΘ▒╝.php?msg=${encodeURIComponent(message)}&lc=zh`);
            
            const reply = response.data?.data?.text || response.data?.success || "I'm thinking...";
            
            await sock.sendMessage(from, { 
                text: `≡ƒÆ¼ *SimSimi:* ${reply}`,
                contextInfo 
            }, { quoted: msg });
            
        } catch (err) {
            // Fallback responses
            const fallbacks = [
                "≡ƒñö I'm thinking about that!",
                "≡ƒÿà That's an interesting one!",
                "≡ƒñô Let me think...",
                "≡ƒÆ¡ Hmm... interesting!"
            ];
            const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            
            await sock.sendMessage(from, { 
                text: `≡ƒÆ¼ ${fallback}`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
