const { createForwardedContext } = require('./_helpers');

const poems = [
    "Roses are red,\nViolets are blue,\nSugar is sweet,\nAnd so are you!",
    
    "Twinkle, twinkle, little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.",
    
    "I think that the world would be better\nIf we all just learned to be kind,\nTo share with each other,\nAnd help one another.",
    
    "The road goes ever on and on\nDown from the door where it began.\nNow far ahead the road has gone,\nAnd I must follow, if I can.",
    
    "In the middle of the journey of our life\nI found myself within a dark woods\nWhere the straight way was lost.\n— Dante Alighieri",
    
    "Hope is the thing with feathers\nThat perches in the soul,\nAnd sings the tune without the words,\nAnd never stops at all.\n— Emily Dickinson",
    
    "Do not go gentle into that good night,\nOld age should burn and rave at close of day;\nRage, rage against the dying of the light.\n— Dylan Thomas",
    
    "I wandered lonely as a cloud\nThat floats on high o'er vales and hills,\nWhen all at once I saw a crowd,\nA host of golden daffodils.\n— William Wordsworth",
    
    "Two roads diverged in a wood, and I—\nI took the one less traveled by,\nAnd that has made all the difference.\n— Robert Frost",
    
    "She walks in beauty, like the night\nOf cloudless climes and starry skies;\nAnd all that's best of dark and bright\nMeet in her aspect and her eyes.\n— Lord Byron"
];

module.exports = {
    name: "poem",
    aliases: ["poetry", "verse"],
    description: "Get a random poem",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const poem = poems[Math.floor(Math.random() * poems.length)];
        
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
            text: `📝 *Random Poem*\n\n${poem}`,
            contextInfo
        }, { quoted: msg });
        
        await sock.sendMessage(from, { react: { text: '📝', key: msg.key } });
    }
};
