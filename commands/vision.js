'use strict';

const { Message } = require('discord.js');
const { GPT4VisionAPI } = require('gpt4-vision-api'); // Hypothetical import for the GPT-4 Vision API

module.exports = {
    name: 'vision',
    aliases: ['analyze', 'imageanalysis'],
    description: 'Analyzes images and provides details using GPT-4 Vision API.',
    async execute(message = new Message()) {
        // Check if the message is a reply to an image
        if (message.reference && message.attachments.size > 0) {
            const imageUrl = message.attachments.first().url;
            try {
                // Call the GPT-4 Vision API with the image URL
                const analysis = await GPT4VisionAPI.analyze(imageUrl);

                // Format the response
                const response = `**Description:** ${analysis.description}\n` +
                                `**Objects Detected:** ${analysis.objects.join(', ')}\n` +
                                `**Colors and Composition:** ${analysis.colors}\n` +
                                `**Scene/Location:** ${analysis.scene}\n` +
                                `**Mood and Atmosphere:** ${analysis.mood}\n` +
                                `**Visible Text:** ${analysis.text || 'N/A'}\n` +
                                `**Notable Details:** ${analysis.details}\n` +
                                `**Image Quality/Style:** ${analysis.quality}`;

                // Send the analysis response
                await message.channel.send(response);
            } catch (error) {
                console.error('Error analyzing image:', error);
                await message.channel.send('There was an error analyzing the image.');
            }
        } else {
            await message.channel.send('Please reply to a message with an image to analyze.');
        }
    }
};