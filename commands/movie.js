const { createForwardedContext } = require('./_helpers');

const movies = [
    "≡ƒÄ¼ *Inception* - Mind-bending sci-fi thriller",
    "≡ƒÄ¼ *The Dark Knight* - Epic superhero drama",
    "≡ƒÄ¼ *Interstellar* - Space odyssey",
    "≡ƒÄ¼ *Parasite* - Award-winning thriller",
    "≡ƒÄ¼ *Avengers: Endgame* - Epic crossover",
    "≡ƒÄ¼ *The Shawshank Redemption* - Inspirational classic",
    "≡ƒÄ¼ *Joker* - Dark psychological thriller",
    "≡ƒÄ¼ *Spider-Man: Into the Spider-Verse* - Animated masterpiece",
    "≡ƒÄ¼ *Oppenheimer* - Historical drama",
    "≡ƒÄ¼ *Barbie* - Fun comedy adventure",
    "≡ƒÄ¼ *Avatar* - Visual spectacle",
    "≡ƒÄ¼ *Everything Everywhere All at Once* - Wild multiverse ride",
    "≡ƒÄ¼ *Top Gun: Maverick* - High-octane action",
    "≡ƒÄ¼ *The Godfather* - Timeless crime saga",
    "≡ƒÄ¼ *Forrest Gump* - Heartwarming story"
];

module.exports = {
    name: "movie",
    aliases: ["films", "watch", "movies"],
    description: "Get a movie recommendation",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const movie = movies[Math.floor(Math.random() * movies.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒÄ¼ *MOVIE RECOMMENDATION:*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n${movie}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒì┐ Use !movie again for more recommendations!`,
            contextInfo 
        }, { quoted: msg });
    }
};
