const fs = require('fs');
const path = require('path');

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCFEZv60eBdlqXqQz20';
const CHANNEL_CODE = '0029VbCFEZv60eBdlqXqQz20';

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

module.exports = {
    name: 'menu',
    aliases: ['commands', 'cmd', 'list'],

    async execute(sock, msg) {
        const from = msg.key.remoteJid;
        const allCommands = getAllCommands();
        
        // Create menu with all commands and their prompts/descriptions
        const menuHeader = `╔══════════════════════════════════╗
║        ⟦ 𓆩𖤍 NΞXØRΛ 𖤍𓆪 ⟧        
║        COMMAND MENU (ALL)     
╚══════════════════════════════════╝

╭─〔 📋 ALL COMMANDS 〕─╮
│ Total: ${allCommands.length} commands
╰──────────────────────╯

`;

        // Build command list with prompts
        const commandsList = allCommands.map(cmd => 
            `│ ⌬ !${cmd.name}\n│    📝 ${cmd.description}`
        ).join('\n\n');

        const menuFooter = `
══════════════════════════════════
> Powered by ⟦ 𓆩𖤍 NΞXØRΛ 𖤍𓆪 ⟧ ⚡
> Use !<command> to run any command
> Example: !menu, !help, !ping`;

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
                title: 'NEXORA Commands',
                body: `Total: ${allCommands.length} commands - Use !<command> to run`,
                sourceUrl: CHANNEL_LINK,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };

        // Combine all into one message
        const fullMenu = menuHeader + commandsList + menuFooter;

        // Send as image with caption first
        await sock.sendMessage(
            from,
            {
                image: { url: 'https://i.postimg.cc/NjpbYcY5/IMG-20260320-WA0012.jpg' },
                caption: fullMenu.substring(0, 1024), // Limit caption length
                contextInfo
            },
            { quoted: msg }
        ).catch(async (err) => {
            console.error('menu command image send failed, using text fallback:', err?.message || err);
            // Send as text if image fails
            // Split into parts if too long (WhatsApp limit ~6500 chars)
            const maxLength = 6000;
            if (fullMenu.length <= maxLength) {
                return sock.sendMessage(
                    from,
                    { text: fullMenu, contextInfo },
                    { quoted: msg }
                );
            }
            
            // Send in parts
            const parts = [];
            for (let i = 0; i < fullMenu.length; i += maxLength) {
                parts.push(fullMenu.substring(i, i + maxLength));
            }
            
            for (let i = 0; i < parts.length; i++) {
                await sock.sendMessage(
                    from,
                    { text: parts[i], contextInfo },
                    { quoted: msg }
                );
                if (i < parts.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        });
    }
};