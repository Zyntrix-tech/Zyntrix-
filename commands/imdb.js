const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "imdb",
    aliases: ["movieinfo", "film"],
    description: "Get movie/TV show information from IMDB",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        if (!args.length) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `≡ƒÄ¼ *IMDB SEARCH*\n\nUsage: !imdb <movie or TV show>\n\nExample:\n!imdb Inception\n!imdb Breaking Bad`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const query = args.join(' ');
        
        await sock.sendMessage(from, { react: { text: '≡ƒÄ¼', key: msg.key } });
        
        try {
            // Using OMDB API (free tier)
            const response = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=trilogy`);
            
            if (response.data.Response === "False") {
                throw new Error('Not found');
            }
            
            const movie = response.data;
            
            let text = `≡ƒÄ¼ *${movie.Title}* (${movie.Year})\n\n`;
            text += `Γ¡É *Rating:* ${movie.imdbRating}/10\n`;
            text += `≡ƒÄ¡ *Genre:* ${movie.Genre}\n`;
            text += `ΓÅ▒∩╕Å *Runtime:* ${movie.Runtime}\n`;
            text += `≡ƒæÑ *Cast:* ${movie.Actors}\n\n`;
            text += `≡ƒôû *Plot:* ${movie.Plot}\n\n`;
            text += `≡ƒöù https://imdb.com/title/${movie.imdbID}`;
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { text: text, contextInfo }, { quoted: msg });
            
        } catch (err) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ¥î Could not find "${query}".\n\nPlease check the name and try again.`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
