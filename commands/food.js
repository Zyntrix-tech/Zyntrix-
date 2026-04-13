const { createForwardedContext } = require('./_helpers');

const foods = [
    "≡ƒìò *Pizza* - Everyone's favorite!",
    "≡ƒìö *Burger* - Classic comfort food",
    "≡ƒìƒ *Fries* - Perfect crispy snack",
    "≡ƒî« *Tacos* - Flavor explosion!",
    "≡ƒìú *Sushi* - Elegant and delicious",
    "≡ƒì£ *Noodles* - Comfort in a bowl",
    "≡ƒÑù *Salad* - Fresh and healthy",
    "≡ƒì¢ *Curry* - Rich and aromatic",
    "≡ƒì¥ *Pasta* - Italian perfection",
    "≡ƒî» *Burrito* - Filling and tasty",
    "≡ƒì⌐ *Donuts* - Sweet treat!",
    "≡ƒìª *Ice Cream* - Cold delight",
    "≡ƒÑæ *Avocado Toast* - Trendy brunch",
    "≡ƒìù *Fried Chicken* - Crispy goodness",
    "≡ƒÑ⌐ *Steak* - For meat lovers!"
];

module.exports = {
    name: "food",
    aliases: ["eat", "foodie", "recommendfood"],
    description: "Get a food recommendation",

    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        
        const contextInfo = createForwardedContext();
        
        const food = foods[Math.floor(Math.random() * foods.length)];
        
        await sock.sendMessage(from, { 
            text: `≡ƒìö *FOOD RECOMMENDATION:*\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n${food}\n\nΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöü\n\n≡ƒÿï Use !food again for more ideas!`,
            contextInfo 
        }, { quoted: msg });
    }
};
