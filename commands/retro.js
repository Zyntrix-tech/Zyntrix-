const axios = require('axios');

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCFEZv60eBdlqXqQz20';
const CHANNEL_CODE = '0029VbCFEZv60eBdlqXqQz20';

const retroArt = `
ΓòöΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòù
Γòæ     ≡ƒò╣∩╕Å  WELCOME TO RETRO WORLD  ≡ƒò╣∩╕Å     Γòæ
ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥

    ΓûêΓûêΓûêΓûêΓûêΓûêΓòù ΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòù ΓûêΓûêΓûêΓûêΓûêΓòù ΓûêΓûêΓûêΓûêΓûêΓûêΓòù 
    ΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòöΓòÉΓòÉΓòÉΓòÉΓò¥ΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòù
    ΓûêΓûêΓûêΓûêΓûêΓûêΓòöΓò¥ΓûêΓûêΓûêΓûêΓûêΓòù  ΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòæΓûêΓûêΓòæ  ΓûêΓûêΓòæ
    ΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòöΓòÉΓòÉΓò¥  ΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòæΓûêΓûêΓòæ  ΓûêΓûêΓòæ
    ΓûêΓûêΓòæ  ΓûêΓûêΓòæΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòùΓûêΓûêΓòæ  ΓûêΓûêΓòæΓûêΓûêΓûêΓûêΓûêΓûêΓòöΓò¥
    ΓòÜΓòÉΓò¥  ΓòÜΓòÉΓò¥ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥ΓòÜΓòÉΓò¥  ΓòÜΓòÉΓò¥ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥ 
                                    
    ΓûêΓûêΓûêΓòù   ΓûêΓûêΓûêΓòù ΓûêΓûêΓûêΓûêΓûêΓûêΓòù ΓûêΓûêΓûêΓûêΓûêΓûêΓòù ΓûêΓûêΓòùΓûêΓûêΓòù   ΓûêΓûêΓòùΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòù
    ΓûêΓûêΓûêΓûêΓòù ΓûêΓûêΓûêΓûêΓòæΓûêΓûêΓòöΓòÉΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòæΓûêΓûêΓòæ   ΓûêΓûêΓòæΓûêΓûêΓòöΓòÉΓòÉΓòÉΓòÉΓò¥
    ΓûêΓûêΓòöΓûêΓûêΓûêΓûêΓòöΓûêΓûêΓòæΓûêΓûêΓòæ   ΓûêΓûêΓòæΓûêΓûêΓûêΓûêΓûêΓûêΓòöΓò¥ΓûêΓûêΓòæΓûêΓûêΓòæ   ΓûêΓûêΓòæΓûêΓûêΓûêΓûêΓûêΓòù  
    ΓûêΓûêΓòæΓòÜΓûêΓûêΓòöΓò¥ΓûêΓûêΓòæΓûêΓûêΓòæ   ΓûêΓûêΓòæΓûêΓûêΓòöΓòÉΓòÉΓûêΓûêΓòùΓûêΓûêΓòæΓûêΓûêΓòæ   ΓûêΓûêΓòæΓûêΓûêΓòöΓòÉΓòÉΓò¥  
    ΓûêΓûêΓòæ ΓòÜΓòÉΓò¥ ΓûêΓûêΓòæΓòÜΓûêΓûêΓûêΓûêΓûêΓûêΓòöΓò¥ΓûêΓûêΓòæ  ΓûêΓûêΓòæΓûêΓûêΓòæΓòÜΓûêΓûêΓûêΓûêΓûêΓûêΓòöΓò¥ΓûêΓûêΓûêΓûêΓûêΓûêΓûêΓòù
    ΓòÜΓòÉΓò¥     ΓòÜΓòÉΓò¥ ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥ ΓòÜΓòÉΓò¥  ΓòÜΓòÉΓò¥ΓòÜΓòÉΓò¥ ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥ ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥

≡ƒÄ« RETRO GAMES ARE COOL! ≡ƒÄ«
`;

module.exports = {
    name: 'retro',

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const args = msg.message?.conversation?.split(' ') || [];
        const query = args.slice(1).join(' ');

        const newsletterJid = process.env.NEWSLETTER_JID || `${CHANNEL_CODE}@newsletter`;

        const contextInfo = {
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid,
                newsletterName: 'NEXORA',
                serverMessageId: 1
            },
            externalAdReply: {
                title: 'RETRO COMMAND',
                body: 'Welcome to Retro World!',
                sourceUrl: CHANNEL_LINK,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        if (!query) {
            // No query - show retro welcome message (no image)
            return sock.sendMessage(
                from,
                {
                    text: `${retroArt}

Γò¡ΓöÇπÇö ≡ƒôû USAGE πÇòΓöÇΓò«
Γöé !retro <text> ΓåÆ
Γöé Convert text to
Γöé retro style!
Γò░ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓò»

> Powered by Γƒª ≡ôå⌐≡ûñì N╬₧X├ÿR╬¢ ≡ûñì≡ôå¬ Γƒº ΓÜí`,
                    contextInfo
                },
                { quoted: msg }
            );
        }

        // Convert text to retro style (zalgo/retro text)
        const retroText = toRetroStyle(query);

        return sock.sendMessage(
            from,
            {
                text: `${retroArt}

Γò¡ΓöÇπÇö ≡ƒöä RETRO CONVERSION πÇòΓöÇΓò«
Γöé Input : ${query}
Γöé Output:
Γöé ${retroText}
Γò░ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓò»

> Powered by Γƒª ≡ôå⌐≡ûñì N╬₧X├ÿR╬¢ ≡ûñì≡ôå¬ Γƒº ΓÜí`,
                contextInfo
            },
            { quoted: msg }
        );
    }
};

function toRetroStyle(text) {
    // Convert text to retro/cool style
    const retroChars = {
        'a': '─à', 'b': '╞à', 'c': '─ï', 'd': '─æ', 'e': '─Ö', 'f': '╞Æ', 
        'g': '─í', 'h': '─º', 'i': '─»', 'j': '─╡', 'k': '─╖', 'l': '┼é', 
        'm': '╔▒', 'n': '┼ä', 'o': '├╕', 'p': '├╛', 'q': '╟½', 'r': '┼ò', 
        's': '┼í', 't': '┼º', 'u': '┼│', 'v': 'ß╣╜', 'w': '┼╡', 'x': '╧ç', 
        'y': '├╜', 'z': '┼╛',
        'A': '─ä', 'B': '╞ü', 'C': '─è', 'D': '─É', 'E': '─ÿ', 'F': '╞æ', 
        'G': '─á', 'H': '─ª', 'I': '─«', 'J': '─┤', 'K': '─╢', 'L': '┼ü', 
        'M': 'ß╣Ç', 'N': '┼â', 'O': '├ÿ', 'P': '├₧', 'Q': '╟¬', 'R': '┼ö', 
        'S': '┼á', 'T': '┼ª', 'U': '┼▓', 'V': 'ß╣╝', 'W': '┼┤', 'X': '╬º', 
        'Y': '├¥', 'Z': '┼╜'
    };
    
    let result = '';
    for (const char of text) {
        if (retroChars[char]) {
            result += retroChars[char];
        } else {
            result += char;
        }
    }
    return result;
}
