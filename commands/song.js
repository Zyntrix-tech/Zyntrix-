const { createForwardedContext } = require('./_helpers');

const songs = [
    "≡ƒÄ╡ *Blinding Lights* - The Weeknd",
    "≡ƒÄ╡ *Shape of You* - Ed Sheeran",
    "≡ƒÄ╡ *Dance Monkey* - Tones and I",
    "≡ƒÄ╡ *Someone You Loved* - Lewis Capaldi",
    "≡ƒÄ╡ *Bad Guy* - Billie Eilish",
    "≡ƒÄ╡ *Se├▒orita* - Shawn Mendes & Camila Cabello",
    "≡ƒÄ╡ *Sunflower* - Post Malone & Swae Lee",
    "≡ƒÄ╡ *Stay* - The Kid LAROI & Justin Bieber",
    "≡ƒÄ╡ *Believer* - Imagine Dragons",
    "≡ƒÄ╡ *Perfect* - Ed Sheeran",
    "≡ƒÄ╡ *Uptown Funk* - Bruno Mars",
    "≡ƒÄ╡ *Shallow* - Lady Gaga & Bradley Cooper",
    "≡ƒÄ╡ *Closer* - The Chainsmokers",
    "≡ƒÄ╡ *Rockstar* - Post Malone",
    "≡ƒÄ╡ *Happier* - Marshmello"
];

module.exports = {
    name: "song",
    aliases: ["music", "recommend", "songs"],
    description: "Get a song recommendation",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const song = songs[Math.floor(Math.random() * songs.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒÄ╡ *SONG RECOMMENDATION:*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n${song}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÄº Use !song again for more recommendations!`,
            contextInfo 
        }, { quoted: msg });
    }
};
