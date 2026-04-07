# Zyntrix WhatsApp Bot

A powerful WhatsApp bot manager built with Telegram integration for Railway deployment.

## 🚀 Quick Start

This bot allows users to connect their WhatsApp accounts through a Telegram interface, then use 200+ commands on WhatsApp.

### Railway Deployment

1. **Fork/Clone this repository**
2. **Deploy to Railway:**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect this as a Node.js app
   - Set the `BOT_TOKEN` environment variable

3. **Environment Variables:**
   ```bash
   BOT_TOKEN=your_telegram_bot_token_here
   ```

## 📱 How It Works

1. **Telegram Bot**: Users interact with @your_bot_username on Telegram
2. **WhatsApp Connection**: Users link their WhatsApp via QR code or pairing code
3. **Command Execution**: Once connected, users can use commands on WhatsApp

## 🎮 Available Commands

The bot includes 200+ commands including:
- AI Chat (`.ai`, `.darkai`)
- Media downloads (YouTube, TikTok, Instagram)
- Group management (kick, promote, ban)
- Fun commands (games, memes, quotes)
- Utility commands (weather, calculator, translator)

## 🛠️ Project Structure

```
├── bot.js                 # Railway entry point
├── healthcheck.js         # Startup validation
├── backend/
│   └── bots/
│       ├── telegram.js    # Telegram bot logic
│       ├── commands/      # 200+ command files
│       └── sessions/      # WhatsApp sessions
└── package.json          # Dependencies & scripts
```

## 🔧 Configuration

### Required Environment Variables
- `BOT_TOKEN`: Your Telegram bot token from BotFather

### Optional Environment Variables
- `PREFIX`: Command prefix (default: `.`)
- `OWNER_JID`: WhatsApp number for owner
- `NEWSLETTER_LINK`: WhatsApp channel link

## 🚦 Railway Logs

The bot provides detailed logging:
- ✅ Command loading status
- 📨 Command execution tracking
- 🔴 Error reporting with details
- 🌐 Connection status updates

## 🐛 Troubleshooting

### Common Issues:
1. **409 Conflict**: Multiple bot instances - Railway handles this automatically
2. **BOT_TOKEN missing**: Add to Railway environment variables
3. **Commands not loading**: Check `backend/bots/commands/` directory

### Health Check
The bot runs a health check on startup to validate:
- Environment variables
- File structure
- Dependencies
- Command files

## 📝 License

ISC License - See package.json for details.

## 🤝 Support

For issues or questions, check the Railway logs for detailed error messages.