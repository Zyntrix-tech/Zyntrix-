const { _helpers } = require('../_helpers');

/**
 * Anime Command
 * This command generates an anime image using the Waifu.pics API.
 *
 * @param {Object} context - The context object for the command.
 */
module.exports = {
    name: 'anime',
    description: 'Generates an anime image',
    async execute(context) {
        const prefix = '!anime';
        const command = context.message.text;

        // Check if the message starts with the anime prefix
        if (command.startsWith(prefix)) {
            try {
                const response = await fetch('https://api.waifu.pics/sfw/waifu');
                const data = await response.json();

                // Your implementation for sending the image back to the user
                const imageUrl = data.url;
                context.reply(`Here is your anime image: ${imageUrl}`);
            } catch (error) {
                context.reply('Something went wrong while fetching an anime image.');
                console.error(error);
            }
        }
    },
};