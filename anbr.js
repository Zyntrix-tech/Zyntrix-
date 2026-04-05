const { createForwardedContext } = require('_helpers');

module.exports = {
    name: 'anbr',
    description: 'Search for anime by name',
    execute(sock, msg, args) {
        const animeName = args.join(' ');
        if (!animeName) {
            return msg.reply('Please provide the name of the anime.');
        }

        // Search for anime images using Waifu.pics or anime search API
        fetch(`https://api.waifu.pics/sfw/neko`) // Example API, replace with actual API
            .then(response => response.json())
            .then(data => {
                const imageUrl = data.url;
                msg.reply({ files: [imageUrl] });
            })
            .catch(err => {
                console.error(err);
                msg.reply('Error fetching anime images.');
            });
    },
};