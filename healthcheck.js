#!/usr/bin/env node

/**
 * Railway Startup Health Check
 * Validates environment and dependencies before starting the bot
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(60));
console.log('🚀 Zyntrix WhatsApp Bot - Railway Startup Health Check');
console.log('='.repeat(60) + '\n');

// 1. Check environment variables
console.log('📋 Checking environment variables...');
const requiredEnv = ['BOT_TOKEN'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0) {
    console.error(`\n❌ Missing required environment variables:`);
    missingEnv.forEach(env => console.error(`   - ${env}`));
    console.error('\n⚠️  Add these to Railway environment variables: https://railway.app');
    process.exit(1);
}
console.log('✅ All environment variables present');

// 2. Check directory structure
console.log('\n📁 Checking directory structure...');
const requiredDirs = [
    './backend/bots',
    './backend/bots/commands',
    './backend/bots/utils'
];

for (const dir of requiredDirs) {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        console.error(`\n❌ Missing directory: ${dir}`);
        process.exit(1);
    }
    console.log(`  ✅ ${dir}`);
}

// 3. Check critical files
console.log('\n📄 Checking critical files...');
const requiredFiles = [
    './backend/bots/telegram.js',
    './backend/bots/index.js',
    './bot.js'
];

for (const file of requiredFiles) {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
        console.error(`\n❌ Missing file: ${file}`);
        process.exit(1);
    }
    console.log(`  ✅ ${file}`);
}

// 4. Check command files
console.log('\n🎮 Checking commands...');
const commandsDir = path.join(__dirname, './backend/bots/commands');
const commandCount = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js')).length;
console.log(`  ✅ ${commandCount} command files found`);

if (commandCount === 0) {
    console.warn('  ⚠️  Warning: No command files found!');
}

// 5. Check dependencies
console.log('\n📦 Checking dependencies...');
const requiredDeps = [
    'node-telegram-bot-api',
    '@whiskeysockets/baileys',
    'qrcode',
    'pino',
    'axios'
];

const packageJson = require('./package.json');
for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep]) {
        console.log(`  ✅ ${dep}`);
    } else {
        console.error(`  ❌ Missing dependency: ${dep}`);
    }
}

// 6. Test require paths
console.log('\n🧪 Testing require paths...');
try {
    require('node-telegram-bot-api');
    console.log('  ✅ node-telegram-bot-api');
} catch (e) {
    console.error('  ❌ node-telegram-bot-api:', e.message);
}

try {
    require('@whiskeysockets/baileys');
    console.log('  ✅ @whiskeysockets/baileys');
} catch (e) {
    console.error('  ❌ @whiskeysockets/baileys:', e.message);
}

// Success!
console.log('\n' + '='.repeat(60));
console.log('✅ All health checks passed! Starting bot...\n');
console.log('='.repeat(60) + '\n');

// Start the bot
require('./bot.js');
