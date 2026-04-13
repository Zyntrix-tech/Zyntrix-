const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'anbr',
    description: 'Search for anime by name',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const animeName = args.join(' ');

        if (!animeName) {
            const contextInfo = createForwardedContext();
            return sock.sendMessage(from, {
                text: 'Please provide the name of the anime.',
                contextInfo
            }, { quoted: msg });
        }

        try {
            const response = await fetch('https://api.waifu.pics/sfw/neko');
            const data = await response.json();
            const imageUrl = data.url;

            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: `Anime result for "${animeName}":`,
                contextInfo
            }, { quoted: msg });

            await sock.sendMessage(from, {
                image: { url: imageUrl },
                caption: `Anime: ${animeName}`
            });
        } catch (err) {
            console.error(err);
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, {
                text: 'Error fetching anime images.',
                contextInfo
            }, { quoted: msg });
        }
    },
};