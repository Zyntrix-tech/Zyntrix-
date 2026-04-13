const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "dog",
    aliases: ["puppy", "doggo", "dogs"],
    description: "Get a random dog picture",

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        
        try {
            // Send reaction
            await sock.sendMessage(from, { react: { text: "≡ƒÉò", key: msg.key } });

            // Fetch random dog image
            const response = await axios.get("https://dog.ceo/api/breeds/image/random");
            
            if (!response.data?.message) {
                const contextInfo = createForwardedContext();
                await sock.sendMessage(from, { 
                    text: "≡ƒÉ╢ Failed to get dog image. Try again!", 
                    contextInfo 
                }, { quoted: msg });
                return;
            }

            const imageUrl = response.data.message;
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                image: { url: imageUrl }, 
                caption: "≡ƒÉ╢ Woof! Here's a cute dog for you!",
                contextInfo
            }, { quoted: msg });

            // Success reaction
            await sock.sendMessage(from, { react: { text: "Γ¥ñ∩╕Å", key: msg.key } });

        } catch (error) {
            console.error("Dog command error:", error);
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: "≡ƒÉ╢ Error getting dog image. Please try again!", 
                contextInfo 
            }, { quoted: msg });
        }
    }
};
