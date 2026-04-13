const { createForwardedContext } = require('./_helpers');

const shayari = [
    "≡ƒÆò *αññαÑçαñ░αÑÇ αñ«αÑüαñ╕αÑìαñòαñ╛αñ¿ αñ«αÑçαñ░αÑÇ αñ£αñ╛αñ¿ αñ╣αÑê,\nαññαÑé αñ«αÑçαñ░αÑÇ αñ╢αñ╛αñ¿ αñ╣αÑêαÑñ*\n\n~ Love",
    
    "≡ƒî╣ *αññαÑüαñ«αÑìαñ╣αñ╛αñ░αÑÇ αñ»αñ╛αñªαÑïαñé αñòαñ╛ αñ╕αñ╣αñ╛αñ░αñ╛ αñ╣αÑê αñ«αÑüαñ¥αÑç,\nαññαÑüαñ«αÑìαñ╣αñ╛αñ░αñ╛ αñçαñéαññαñ£αñ╝αñ╛αñ░ αñ¬αÑìαñ»αñ╛αñ░αñ╛ αñ╣αÑê αñ«αÑüαñ¥αÑçαÑñ*\n\n~ Romance",
    
    "Γ£¿ *αñ«αÑïαñ╣αñ¼αÑìαñ¼αññ αñ«αÑçαñé αññαÑçαñ░αÑÇ αñçαñ╕ αñòαñªαñ░ αñûαÑï αñùαñÅ,\nαñòαñ┐ αñàαñ¬αñ¿αÑç αñåαñ¬ αñ╕αÑç αñ¡αÑÇ αñ¼αÑçαñùαñ╛αñ¿αÑç αñ╣αÑï αñùαñÅαÑñ*\n\n~ Deep Love",
    
    "≡ƒÆ½ *αñÜαñ╛αñüαñª αñòαÑï αñªαÑçαñûαñ╛ αññαÑï αññαÑçαñ░αñ╛ αñÜαÑçαñ╣αñ░αñ╛ αñ»αñ╛αñª αñåαñ»αñ╛,\nαñ½αÑéαñ▓αÑïαñé αñòαÑï αñªαÑçαñûαñ╛ αññαÑï αññαÑçαñ░αÑÇ αñûαÑüαñ╢αñ¼αÑé αñ»αñ╛αñª αñåαñêαÑñ*\n\n~ Missing You",
    
    "≡ƒî╕ *αññαÑçαñ░αÑÇ αñåαñüαñûαÑïαñé αñ«αÑçαñé αñûαÑï αñ£αñ╛αñ¿αÑç αñòαñ╛ αñ«αñ¿ αñ╣αÑê,\nαññαÑçαñ░αÑç αñ¼αñ┐αñ¿αñ╛ αñ£αÑÇαñ¿αÑç αñòαñ╛ αñ«αñ¿ αñ¿αñ╣αÑÇαñé αñ╣αÑêαÑñ*\n\n~ Romance",
    
    "≡ƒÆû *αñ«αÑïαñ╣αñ¼αÑìαñ¼αññ αñ╕αñÜαÑìαñÜαÑÇ αñ╣αÑïαññαÑÇ αñ╣αÑê,\nαñ£αÑï αñªαñ┐αñ▓ αñ╕αÑç αñªαñ┐αñ▓ αñ«αñ┐αñ▓αññαÑÇ αñ╣αÑêαÑñ*\n\n~ Truth",
    
    "Γ¡É *αññαÑé αñ╣αÑê αññαÑï αñ╕αñ¼ αñòαÑüαñ¢ αñ╣αÑê,\nαññαÑçαñ░αÑç αñ¼αñ┐αñ¿αñ╛ αñàαñºαÑéαñ░αñ╛ αñ╣αÑêαÑñ*\n\n~ Complete",
    
    "≡ƒöÑ *αññαÑüαñ«αÑìαñ╣αñ╛αñ░αÑÇ αñ¼αñ╛αñ╣αÑïαñé αñ«αÑçαñé αñûαÑï αñ£αñ╛αñ¿αÑç αñòαñ╛ αñ«αñ¿ αñ╣αÑê,\nαñÅαñò αñ¬αñ▓ αñòαÑç αñ▓αñ┐αñÅ αññαÑüαñ«αÑìαñ╣αñ╛αñ░αñ╛ αñ╣αÑï αñ£αñ╛αñ¿αÑç αñòαñ╛ αñ«αñ¿ αñ╣αÑêαÑñ*\n\n~ Desire",
    
    "≡ƒî║ *αñ¬αÑìαñ»αñ╛αñ░ αñ«αÑçαñé αññαÑçαñ░αÑç αñ¬αñ╛αñùαñ▓ αñ╣αÑéαñé αñ«αÑêαñé,\nαññαÑçαñ░αÑÇ αñ╣αñ░ αñ¼αñ╛αññ αñòαñ╛ αññαñ╛αñ▓αÑé αñ╣αÑéαñé αñ«αÑêαñéαÑñ*\n\n~ Crazy Love",
    
    "≡ƒÆ¥ *αñªαñ┐αñ▓ αñ«αÑçαñé αññαÑçαñ░αÑÇ αñ£αñùαñ╣ αñ╣αÑê,\nαñåαñüαñûαÑïαñé αñ«αÑçαñé αññαÑçαñ░αÑÇ αñÜαñ╛αñ╣ αñ╣αÑêαÑñ*\n\n~ Heart"
];

const englishPoetry = [
    "≡ƒÆò *In your eyes, I found my home,\nIn your heart, I found my own.*\n\n~ Love",
    
    "Γ£¿ *You are my sunshine on cloudy days,\nMy anchor when I drift away.*\n\n~ You",
    
    "≡ƒîÖ *Two souls, one beat,\nTogether complete.*\n\n~ Us",
    
    "≡ƒÆ½ *Love is not about how long we stay,\nBut how deeply we're willing to stay.*\n\n~ Truth",
    
    "Γ¡É *In a garden of roses, you are my rose,\nIn a world of many, you're the one I chose.*\n\n~ Forever"
];

module.exports = {
    name: "shayari",
    aliases: ["poetry", "lovepoem", "romantic"],
    description: "Beautiful romantic shayari and poetry",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const useEnglish = args.join(" ").toLowerCase().includes("english");
        
        const poem = useEnglish 
            ? englishPoetry[Math.floor(Math.random() * englishPoetry.length)]
            : shayari[Math.floor(Math.random() * shayari.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒÆò *ROMANTIC SHAYARI:*\n\n${poem}\n\n≡ƒî╣ @Nexora`,
            contextInfo 
        }, { quoted: msg });
    }
};
