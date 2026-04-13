const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'anime',
    description: 'Generates an anime image',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        try {
            const response = await fetch('https://api.waifu.pics/sfw/waifu');
            const data = await response.json();

            const imageUrl = data.url;
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: `Here is your anime image: ${imageUrl}`,
                contextInfo
            }, { quoted: msg });
        } catch (error) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: 'Something went wrong while fetching an anime image.',
                contextInfo
            }, { quoted: msg });
            console.error(error);
        }
    },
};