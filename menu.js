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
            
            const mainMenu = `╔══════════════════════════════════╗
║     ⟦ 𓆩𖤍 NΞXØRΛ 𖤍𓆪 ⟧     
║        MAIN MENU          
╚══════════════════════════════════╝

┌─〔 📊 SYSTEM STATUS 〕─┐
│ 👤 Mode    : ${status.mode.toUpperCase()}
│ ⚡ Uptime  : ${status.uptime}
│ 💾 RAM     : ${status.ram}
│ 📚 Commands: ${status.commands}
│ 💻 Platform: ${status.platform}
└──────────────────────┘

╭─〔 📂 COMMAND CATEGORIES 〕─╮
│ ⌬ !general  → General commands
│ ⌬ !admin    → Admin commands  
│ ⌬ !owner    → Owner commands
│ ⌬ !media    → Media commands
│ ⌬ !tools    → Tools commands
│ ⌬ !all      → All commands
╰───────────────────────────╯

> Powered by ⟦ 𓆩𖤍 NΞXØRΛ 𖤍𓆪 ⟧ ⚡`;

            // Send without forwarded context
            await sock.sendMessage(
                from,
                {
                    image: { url: 'https://i.postimg.cc/NjpbYcY5/IMG-20260320-WA0012.jpg' },
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
                categoryTitle = '⚡ GENERAL COMMANDS';
                break;
            case 'admin':
                categoryCommands = getCommandsByCategory('admin');
                categoryTitle = '👑 ADMIN COMMANDS';
                break;
            case 'owner':
                categoryCommands = getCommandsByCategory('owner');
                categoryTitle = '🔐 OWNER COMMANDS';
                break;
            case 'media':
                categoryCommands = getCommandsByCategory('media');
                categoryTitle = '🎵 MEDIA COMMANDS';
                break;
            case 'tools':
                categoryCommands = getCommandsByCategory('tools');
                categoryTitle = '🧰 TOOLS COMMANDS';
                break;
            case 'all':
                categoryCommands = getAllCommands();
                categoryTitle = '📋 ALL COMMANDS';
                break;
            default:
                // Check if it's a specific command request
                const allCmds = getAllCommands();
                const specificCmd = allCmds.find(c => c.name === category);
                if (specificCmd) {
                    await sock.sendMessage(from, { 
                        text: `⌬ *${specificCmd.name.toUpperCase()}*\n\n📝 ${specificCmd.description}\n\n💡 Use !${specificCmd.name} to run this command!`
                    }, { quoted: msg });
                    return;
                }
                // Invalid category - just return silently
                return;
        }

        // Build category menu with ASCII art
        const menuHeader = `╔═══════════════════════════════════════════════════╗\n` +
            `║     ⟦ 𓆩𖤍 NΞXØRΛ 𖤍𓆪 ⟧                              ║\n` +
            `║    ${categoryTitle.padStart(35)}    ║\n` +
            `╚═══════════════════════════════════════════════════╝\n\n` +
            `╭─〔 📋 ${categoryCommands.length} Commands 〕─╮\n`;
        
        const commandsList = categoryCommands.map(cmd => 
            `│ ⌬ !${cmd.name}\n│    📝 ${cmd.description}`
        ).join('\n\n');
        
        const menuFooter = `\n╰───────────────────────────╯\n\n` +
            `💡 Use !<command> to run any command\n` +
            `📝 Use !menu to go back to main menu\n\n` +
            `> Powered by ⟦ 𓆩𖤍 NΞXØRΛ 𖤍𓆪 ⟧ ⚡`;

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