const { createForwardedContext } = require('./_helpers');

module.exports = {
    name: "yt",

    async execute(sock, msg, args) {
        let ytdl;
        try {
            ytdl = require("ytdl-core");
        } catch (_) {
            const contextInfo = createForwardedContext();
            return sock.sendMessage(msg.key.remoteJid, {
                text: "ytdl-core is not installed. Run: npm i ytdl-core",
                contextInfo
            }, { quoted: msg });
        }

        const url = args[0];

        if (!url || !ytdl.validateURL(url)) {
            const contextInfo = createForwardedContext();
            return sock.sendMessage(msg.key.remoteJid, {
                text: "Γ¥î Please provide a valid YouTube URL",
                contextInfo
            }, { quoted: msg });
        }

        try {

            // Γ¼ç∩╕Å reaction
            await sock.sendMessage(msg.key.remoteJid, {
                react: { text: "Γ¼ç∩╕Å", key: msg.key }
            });

            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;

            // premium loading message
            await sock.sendMessage(msg.key.remoteJid, {
                text:
`Γò¡ΓöüΓöüΓöüπÇö ≡ƒææ NEXORA PREMIUM πÇòΓöüΓöüΓöüΓò«
Γöâ ≡ƒÄ¼ YouTube Downloader
Γöâ ΓÜí Fetching HD Video...
Γöâ ≡ƒôí Optimizing Quality
Γò░ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓò»`,
                contextInfo: createForwardedContext()
            }, { quoted: msg });

            const videoStream = ytdl(url, { quality: "18" });

            await sock.sendMessage(msg.key.remoteJid, {
                video: videoStream,
                caption:
`Γò¡ΓöüΓöüΓöüπÇö ≡ƒææ NEXORA PREMIUM πÇòΓöüΓöüΓöüΓò«
Γöâ ≡ƒÄ¼ ${title}
Γöâ ≡ƒôÑ HD Video Download
Γöâ ΓÜí Powered by Nexora
Γò░ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓò»`,
                contextInfo: createForwardedContext()
            }, { quoted: msg });

            // success reaction
            await sock.sendMessage(msg.key.remoteJid, {
                react: { text: "Γ£à", key: msg.key }
            });

        } catch (err) {

            console.log(err);

            await sock.sendMessage(msg.key.remoteJid, {
                react: { text: "Γ¥î", key: msg.key }
            });

            await sock.sendMessage(msg.key.remoteJid, {
                text:
`Γò¡ΓöüΓöüΓöüπÇö Γ¥î ERROR πÇòΓöüΓöüΓöüΓò«
Γöâ Failed to fetch video
Γöâ Try another link
Γò░ΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓöüΓò»`,
                contextInfo: createForwardedContext()
            }, { quoted: msg });

        }
    }
};
