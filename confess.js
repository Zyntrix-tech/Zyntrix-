const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "confess",
    aliases: ["confession", "secret", "admit"],
    description: "Make a confession",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const sender = msg.pushName || "Someone";
        
        const contextInfo = createForwardedContext();
        
        if (args.length === 0) {
            await sock.sendMessage(from, { 
                text: `≡ƒÆò *CONFESSION TIME*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\nUsage: !confess <message>\n\nExample: !confess I like you\n\nGet something off your chest!`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const confession = args.join(" ");
        const truths = [
            "≡ƒÿ▒ *GASP* That's bold!",
            "≡ƒÆò *Love it!* So brave!",
            "≡ƒÿà *Wow* Didn't see that coming!",
            "≡ƒñ¡ *Shhh* Your secret is safe!",
            "≡ƒÆ¬ *Respect* for being honest!"
        ];
        
        const truth = truths[Math.floor(Math.random() * truths.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒÆò *CONFESSION FROM ${sender}:*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n"${confession}"\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n${truth}`,
            contextInfo 
        }, { quoted: msg });
    }
};
