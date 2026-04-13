const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "sh",
    aliases: ["shorthelp", "qhelp", "quickhelp"],
    description: "Quick help - shows command categories",

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        
        const menu = `ΓòöΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòù
Γòæ   Γƒª NEXORA QUICK HELP Γƒº    Γòæ
ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥

≡ƒôû General
!help ΓåÆ Full menu
!ai ΓåÆ AI chat
!ping ΓåÆ Check latency

≡ƒææ Admin
!kick ΓåÆ Remove member
!promote ΓåÆ Make admin
!tagall ΓåÆ Mention all

≡ƒÄ╡ Media
!play ΓåÆ Spotify search
!yt ΓåÆ YouTube download
!tiktok ΓåÆ TikTok download

≡ƒÄ« Fun
!joke, !meme, !quote
!8ball, !rps, !ttt

≡ƒ¢á Tools
!img ΓåÆ AI image
!apk ΓåÆ Search APKs
!antidelete ΓåÆ Catch deleted messages

ΓÜÖ∩╕Å System
!alive ΓåÆ Bot status
!uptime ΓåÆ Check uptime

> Use !help for full menu`;

        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, { text: menu, contextInfo }, { quoted: msg });
    }
};
