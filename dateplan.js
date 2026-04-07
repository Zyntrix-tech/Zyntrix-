const { createForwardedContext } = require('./_helpers');

const datePlans = [
    "≡ƒîà *Sunset Picnic:* Pack some snacks and watch the sunset at a scenic spot!",
    "≡ƒÄ¼ *Movie Marathon:* Pick a theme (rom-com, horror, action) and watch back-to-back films!",
    "≡ƒì│ *Cook Together:* Try a new recipe together or have a cooking competition!",
    "≡ƒÄ¿ *Art Day:* Visit a museum or try painting/drawing each other!",
    "≡ƒî│ *Adventure Hike:* Find a new trail and explore nature together!",
    "≡ƒÄ« *Gaming Night:* Play video games or board games for some fun competition!",
    "Γÿò *Caf├⌐ Date:* Find a cozy caf├⌐ and talk for hours over coffee!",
    "≡ƒÅû∩╕Å *Beach Day:* Sun, sand, and waves! Perfect for relaxation!",
    "≡ƒÄ¡ *Try Something New:* Take a dance class, cooking class, or pottery together!",
    "≡ƒôÜ *Book Date:* Go to a bookstore, pick books for each other, and read together!",
    "≡ƒÄ╡ *Karaoke Night:* Sing your hearts out at a karaoke bar!",
    "≡ƒîâ *Stargazing:* Find a dark spot and count stars together!",
    "≡ƒÜ┤ *Bike Ride:* Explore your city on bicycles!",
    "≡ƒÄ¬ *Amusement Park:* Thrills and fun all day long!",
    "≡ƒÅá *Movie Night In:* Order pizza, make popcorn, and watch your favorite movies!"
];

module.exports = {
    name: "dateplan",
    aliases: ["dateidea", "romance", "couple"],
    description: "Get a date plan idea",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const plan = datePlans[Math.floor(Math.random() * datePlans.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒÆò *DATE PLAN IDEA:*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n${plan}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓ£¿ Use !dateplan again for more ideas!`,
            contextInfo 
        }, { quoted: msg });
    }
};
