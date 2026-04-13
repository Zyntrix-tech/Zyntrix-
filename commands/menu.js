const fs = require('fs');
const path = require('path');

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCFEZv60eBdlqXqQz20';
const CHANNEL_CODE = '0029VbCFEZv60eBdlqXqQz20';

// Command categories
const CATEGORIES = {
    general: [
        'help', 'menu', 'ping', 'alive', 'uptime', 'ai', 'darkai', 'retro', 'gstatus',
        'joke', 'meme', 'quote', 'dadjoke', 'devjoke', 'fact', 'sciencefact', 'historyfact',
        'techfact', 'food', 'animal', 'spacefact', 'motivation', 'trivia', 'riddle', 'todayspecial',
        'wyr', 'neverhave', 'truth', 'ttt', 'rps', 'slot', '8ball', 'ship', 'choose', 'shuffle',
        'bomb', 'spam', 'hack', 'hack2', 'hack3', 'hackgc', 'hackall', 'destroy', 'emojimix',
        'emojify', 'emojiq', 'tongue', 'insult', 'compliment', 'roast', 'pickup', 'shayari',
        'mood', 'rate', 'crush', 'dateplan', 'hug', 'pat', 'kiss', 'marry', 'goodmorning',
        'goodnight', 'song', 'movie', 'fake', 'glow', 'jail', 'clap', 'sparkle', 'fire',
        'fight', 'cry', 'wink', 'like', 'blush', 'dance', 'laugh', 'shake', 'confess',
        'simsimi', 'flip', 'roll', 'math', 'wasted', 'brainteaser', 'word', 'poem', 'ask',
        'fortune', 'magic', 'wish', 'countdown', 'encode', 'decode', 'binary', 'colorize',
        'history', 'reverse', 'secret', 'steal', 'study', 'typing', 'ftr'
    ],
    admin: [
        'kick', 'kickall', 'promote', 'demote', 'tagall', 'tagadmin', 'warn', 'warnings',
        'clearwarnings', 'mute', 'unmute', 'ban', 'unban', 'tempban', 'gstatus', 'groupstatus',
        'invite', 'ivitelink', 'revoke', 'setname', 'setdesc', 'setnewsletter', 'poll',
        'antidelete'
    ],
    owner: [
        'owner', 'setowner', 'setpp', 'mode', 'setprefix', 'block', 'unblock', 'sh',
        'ftyping', 'frecording', 'tweet', 'tweet2'
    ],
    media: [
        'play', 'lyrics', 'yt', 'tiktok', 'instagram', 'ttsearch', 'img', 'image', 'vv',
        'screenshot', 'sticker', 'logo', 'wallpaper', 'apk', 'movie', 'imdb'
    ],
    tools: [
        'weather', 'short', 'define', 'urban', 'wikipedia', 'time', 'date', 'worldtime',
        'password', 'qrcode', 'bitcoin', 'stock', 'youtube', 'botstats', 'calculate',
        'currency', 'horoscope', 'country', 'bmi', 'weight', 'temp', 'length', 'volume',
        'age', 'health', 'github', 'news', 'ipinfo', 'link', 'sh'
    ]
};

function getCommandsByCategory(category) {
    const categoryCommands = CATEGORIES[category] || [];
    const allCommands = getAllCommands();
    return allCommands.filter(cmd => categoryCommands.includes(cmd.name));
}

function getAllCommands() {
    try {
        const files = fs.readdirSync(__dirname).filter((file) => file.endsWith('.js'));
        const commands = [];

        for (const file of files) {
            try {
                const cmd = require(path.join(__dirname, file));
                if (cmd?.name) {
                    commands.push({
                        name: String(cmd.name).toLowerCase(),
                        description: cmd.description || 'No description'
                    });
                }
                if (Array.isArray(cmd?.aliases)) {
                    for (const alias of cmd.aliases) {
                        if (alias) {
                            commands.push({
                                name: String(alias).toLowerCase(),
                                description: cmd.description || 'No description'
                            });
                        }
                    }
                }
            } catch {
                const fallback = file.replace(/\.js$/i, '').toLowerCase();
                if (fallback) {
                    commands.push({
                        name: fallback,
                        description: 'No description'
                    });
                }
            }
        }

        // Remove duplicates by name
        const uniqueCommands = [];
        const seen = new Set();
        for (const cmd of commands) {
            if (!seen.has(cmd.name)) {
                seen.add(cmd.name);
                uniqueCommands.push(cmd);
            }
        }

        return uniqueCommands.sort((a, b) => a.name.localeCompare(b.name));
    } catch {
        return [];
    }
}

function getSystemStatus() {
    const os = require('os');
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const ramMb = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
    const plugins = getAllCommands().length;
    
    return {
        mode: global.botMode || 'public',
        uptime: `${days}d ${hours}h ${minutes}m`,
        ram: `${ramMb}MB`,
        commands: plugins,
        platform: os.platform()
    };
}

module.exports = {
    name: 'menu',
    aliases: ['commands', 'cmd', 'list', 'general', 'admin', 'owner', 'media', 'tools'],
    
    async execute(sock, msg, args = []) {
        const from = msg.key.remoteJid;
        const text = args.join(' ').toLowerCase();
        
        // Check if a specific category is requested
        const category = text.toLowerCase();
        
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
                title: 'NEXORA Bot',
                body: 'Use !<category> to see commands',
                sourceUrl: CHANNEL_LINK,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        // If no category specified, show main menu with system status
        if (!category || category === 'menu') {
            const status = getSystemStatus();
            
            const mainMenu = `ΓòöΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòù
Γòæ     Γƒª ≡ôå⌐≡ûñì N╬₧X├ÿR╬¢ ≡ûñì≡ôå¬ Γƒº     
Γòæ        MAIN MENU          
ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥

ΓöîΓöÇπÇö ≡ƒôè SYSTEM STATUS πÇòΓöÇΓöÉ
Γöé ≡ƒæñ Mode    : ${status.mode.toUpperCase()}
Γöé ΓÜí Uptime  : ${status.uptime}
Γöé ≡ƒÆ╛ RAM     : ${status.ram}
Γöé ≡ƒôÜ Commands: ${status.commands}
Γöé ≡ƒÆ╗ Platform: ${status.platform}
ΓööΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÿ

Γò¡ΓöÇπÇö ≡ƒôé COMMAND CATEGORIES πÇòΓöÇΓò«
Γöé Γî¼ !general  ΓåÆ General commands
Γöé Γî¼ !admin    ΓåÆ Admin commands  
Γöé Γî¼ !owner    ΓåÆ Owner commands
Γöé Γî¼ !media    ΓåÆ Media commands
Γöé Γî¼ !tools    ΓåÆ Tools commands
Γöé Γî¼ !all      ΓåÆ All commands
Γò░ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓò»

> Powered by Γƒª ≡ôå⌐≡ûñì N╬₧X├ÿR╬¢ ≡ûñì≡ôå¬ Γƒº ΓÜí`;

            // Send without forwarded context
            await sock.sendMessage(
                from,
                {
                    image: { url: 'https://i.postimg.cc/BZ8Y6pdr/71101acb95a308bf48bf58f3a84fe888.jpg' },
                    caption: mainMenu
                },
                { quoted: msg }
            ).catch(async (err) => {
                console.error('menu command image send failed:', err?.message || err);
                await sock.sendMessage(from, { text: mainMenu }, { quoted: msg });
            });
            return;
        }

        // Show specific category
        let categoryCommands = [];
        let categoryTitle = '';
        
        switch (category) {
            case 'general':
                categoryCommands = getCommandsByCategory('general');
                categoryTitle = 'ΓÜí GENERAL COMMANDS';
                break;
            case 'admin':
                categoryCommands = getCommandsByCategory('admin');
                categoryTitle = '≡ƒææ ADMIN COMMANDS';
                break;
            case 'owner':
                categoryCommands = getCommandsByCategory('owner');
                categoryTitle = '≡ƒöÉ OWNER COMMANDS';
                break;
            case 'media':
                categoryCommands = getCommandsByCategory('media');
                categoryTitle = '≡ƒÄ╡ MEDIA COMMANDS';
                break;
            case 'tools':
                categoryCommands = getCommandsByCategory('tools');
                categoryTitle = '≡ƒº░ TOOLS COMMANDS';
                break;
            case 'all':
                categoryCommands = getAllCommands();
                categoryTitle = '≡ƒôï ALL COMMANDS';
                break;
            default:
                // Check if it's a specific command request
                const allCmds = getAllCommands();
                const specificCmd = allCmds.find(c => c.name === category);
                if (specificCmd) {
                    await sock.sendMessage(from, { 
                        text: `Γî¼ *${specificCmd.name.toUpperCase()}*\n\n≡ƒô¥ ${specificCmd.description}\n\n≡ƒÆí Use !${specificCmd.name} to run this command!`
                    }, { quoted: msg });
                    return;
                }
                // Invalid category - just return silently
                return;
        }

        // Build category menu with ASCII art
        const menuHeader = `ΓòöΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòù\n` +
            `Γòæ     Γƒª ≡ôå⌐≡ûñì N╬₧X├ÿR╬¢ ≡ûñì≡ôå¬ Γƒº                              Γòæ\n` +
            `Γòæ    ${categoryTitle.padStart(35)}    Γòæ\n` +
            `ΓòÜΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓò¥\n\n` +
            `Γò¡ΓöÇπÇö ≡ƒôï ${categoryCommands.length} Commands πÇòΓöÇΓò«\n`;
        
        const commandsList = categoryCommands.map(cmd => 
            `Γöé Γî¼ !${cmd.name}\nΓöé    ≡ƒô¥ ${cmd.description}`
        ).join('\n\n');
        
        const menuFooter = `\nΓò░ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓò»\n\n` +
            `≡ƒÆí Use !<command> to run any command\n` +
            `≡ƒô¥ Use !menu to go back to main menu\n\n` +
            `> Powered by Γƒª ≡ôå⌐≡ûñì N╬₧X├ÿR╬¢ ≡ûñì≡ôå¬ Γƒº ΓÜí`;

        const fullMenu = menuHeader + commandsList + menuFooter;

        // Send the category menu without forwarded context
        await sock.sendMessage(
            from,
            {
                image: { url: 'https://i.postimg.cc/NjpbYcY5/IMG-20260320-WA0012.jpg' },
                caption: fullMenu.substring(0, 1024)
            },
            { quoted: msg }
        ).catch(async (err) => {
            console.error('category menu image send failed:', err?.message || err);
            // Fallback to text without context
            const maxLength = 6000;
            if (fullMenu.length <= maxLength) {
                return sock.sendMessage(from, { text: fullMenu }, { quoted: msg });
            }
            
            // Split into parts if too long
            const parts = [];
            for (let i = 0; i < fullMenu.length; i += maxLength) {
                parts.push(fullMenu.substring(i, i + maxLength));
            }
            
            for (let i = 0; i < parts.length; i++) {
                await sock.sendMessage(from, { text: parts[i] }, { quoted: msg });
                if (i < parts.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        });
    }
};
