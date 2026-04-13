const { createForwardedContext } = require('./_helpers');

const pickupLines = [
    "≡ƒîƒ Are you a keyboard? Because you're my type!",
    "≡ƒÆ½ Do you have a map? I keep getting lost in your eyes!",
    "Γ£¿ If you were a fruit, you'd be a Fine-apple!",
    "≡ƒî║ Is your name WiFi? Because I'm feeling a connection!",
    "≡ƒÆû Do you believe in love at first sight, or should I walk by again?",
    "≡ƒöÑ Are you a magician? Because whenever I look at you, everyone else disappears!",
    "Γ¡É Did it hurt when you fell from the sky? You're an angel!",
    "≡ƒÆÄ Are you made of copper and tellurium? Because you are CuTe!",
    "≡ƒîÖ Do you have a Band-Aid? I just scraped my knee falling for you!",
    "≡ƒÄ» Are you a camera? Because every time I look at you, I smile!",
    "≡ƒÆ½ Is your name Google? Because you have everything I've been searching for!",
    "≡ƒî╕ Are you a bank loan? Because you have my interest!",
    "Γ£¿ Do you have a sunburn or are you always this hot?",
    "≡ƒÆû Are you French? Because Eiffel for you!",
    "≡ƒîê Is your dad a baker? Because you're a cutie pie!",
    "≡ƒöÑ Are you a time traveler? Because I can't imagine my future without you!",
    "Γ¡É Do you like stars? Because you're out of this world!",
    "≡ƒÆÄ Are you an alien? Because you just abducted my heart!",
    "≡ƒî║ If you were a cat, you'd purr-fect!",
    "Γ£¿ Are you a keyboard? Because you're my favorite key!",
    "≡ƒÆ½ Is your name Jessica? Because you're so sweet!",
    "≡ƒî╕ Are you a WiFi signal? Because I'm feeling a strong connection!",
    "≡ƒÆû Do you have a name, or can I call you mine?",
    "≡ƒöÑ Are you made of money? Because you're priceless!",
    "Γ¡É Are you a camera? Because you made me smile!"
];

module.exports = {
    name: "pickup",
    aliases: ["flirt", "chatup", "lines"],
    description: "Cheesy pickup lines for fun",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const line = pickupLines[Math.floor(Math.random() * pickupLines.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒÆò *PICKUP LINE:*\n\n${line}\n\n≡ƒÿà Don't blame me, I'm just the messenger!`,
            contextInfo 
        }, { quoted: msg });
    }
};
