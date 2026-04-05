const sock = require('some-socket-library');

module.exports = async (sock, msg, args) => {
    const animeName = args[0];

    if (!animeName) {
        return sock.sendMessage(msg.from, { text: 'Please provide an anime name!' }, { quoted: msg });
    }

    try {
        const response = await fetch(`https://api.waifu.pics/sfw/${animeName}`);
        const data = await response.json();

        if (!data || !data.url) {
            return sock.sendMessage(msg.from, { text: 'No pictures found for this anime!' }, { quoted: msg });
        }

        return sock.sendMessage(msg.from, { image: { url: data.url } }, { quoted: msg });
    } catch (error) {
        console.error(error);
        return sock.sendMessage(msg.from, { text: 'An error occurred while fetching anime images!' }, { quoted: msg });
    }
};
