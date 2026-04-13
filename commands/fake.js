const { createForwardedContext } = require('./_helpers');

const fakeNames = [
    "John Smith", "Emily Johnson", "Michael Brown", "Sarah Davis", "David Wilson",
    "Jennifer Martinez", "Robert Anderson", "Lisa Taylor", "James Thomas", "Maria Garcia"
];

const fakeBios = [
    "Digital nomad exploring the world",
    "Coffee enthusiast and cat lover",
    "Tech geek and movie buff",
    "Adventure seeker and foodie",
    "Music lover and aspiring artist",
    "Bookworm and tea connoisseur",
    "Fitness enthusiast and nature lover",
    "Gamer and pop culture fan",
    "Travel blogger and photographer",
    "Dreamer and doer"
];

module.exports = {
    name: "fake",
    aliases: ["fakeinfo", "generate", "fakeprofile"],
    description: "Generate fake identity info",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
        const bio = fakeBios[Math.floor(Math.random() * fakeBios.length)];
        
        // Generate random age
        const age = Math.floor(Math.random() * 40) + 18;
        
        // Generate random country
        const countries = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Japan", "Brazil"];
        const country = countries[Math.floor(Math.random() * countries.length)];
        
        // Generate random job
        const jobs = ["Developer", "Designer", "Writer", "Artist", "Teacher", "Engineer", "Doctor", "Chef"];
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒÄ¡ *FAKE IDENTITY GENERATED*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒæñ *Name:* ${name}\n≡ƒÄé *Age:* ${age}\n≡ƒîì *Country:* ${country}\n≡ƒÆ╝ *Job:* ${job}\n≡ƒô¥ *Bio:* ${bio}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nΓÜá∩╕Å For entertainment only!`,
            contextInfo 
        }, { quoted: msg });
    }
};
