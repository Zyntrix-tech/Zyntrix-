const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: 'anibr',
    description: 'Fetch an anime image by category',

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const animeName = String(args[0] || '').trim().toLowerCase();

        if (!animeName) {
            return sock.sendMessage(from, {
                text: 'Please provide an anime category or name!',
                contextInfo: createForwardedContext()
            }, { quoted: msg });
        }

        try {
            const response = await fetch(`https://api.waifu.pics/sfw/${encodeURIComponent(animeName)}`);
            const data = await response.json();

            if (!data?.url) {
                return sock.sendMessage(from, {
                    text: 'No pictures found for that anime category.',
                    contextInfo: createForwardedContext()
                }, { quoted: msg });
            }

            return sock.sendMessage(from, {
                image: { url: data.url },
                caption: `Anime result: ${animeName}`,
                contextInfo: createForwardedContext()
            }, { quoted: msg });
        } catch (error) {
            console.error('anibr command error:', error);
            return sock.sendMessage(from, {
                text: 'An error occurred while fetching anime images.',
                contextInfo: createForwardedContext()
            }, { quoted: msg });
        }
    }
};
