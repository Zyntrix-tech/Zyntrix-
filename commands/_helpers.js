const fs = require('fs');
const path = require('path');

// Helper functions for commands

function createForwardedContext() {
    return {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363144038483118@g.us',
            newsletterName: 'Nexora Bot',
            serverMessageId: Date.now()
        }
    };
}

function createContextWithButtons() {
    return {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363144038483118@g.us',
            newsletterName: 'Nexora Bot',
            serverMessageId: Date.now()
        }
    };
}

function isSameUser(user1, user2) {
    if (!user1 || !user2) return false;
    const u1 = String(user1).replace(/[^0-9]/g, '');
    const u2 = String(user2).replace(/[^0-9]/g, '');
    return u1 === u2;
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function cleanText(text) {
    return String(text || '').trim();
}

function isAdmin(sock, jid, userJid) {
    try {
        const participants = sock.store?.contacts?.[jid]?.participants || [];
        const participant = participants.find(p => p.id === userJid);
        return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch (e) {
        return false;
    }
}

function isOwner(userJid) {
    const ownerJid = global.ownerJid;
    return isSameUser(userJid, ownerJid);
}

function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function parseTime(timeString) {
    const regex = /(\d+)([smhd])/g;
    let totalSeconds = 0;
    let match;

    while ((match = regex.exec(timeString.toLowerCase())) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 's': totalSeconds += value; break;
            case 'm': totalSeconds += value * 60; break;
            case 'h': totalSeconds += value * 3600; break;
            case 'd': totalSeconds += value * 86400; break;
        }
    }

    return totalSeconds;
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function capitalizeFirst(text) {
    return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}

function truncate(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function isUrl(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
}

function extractUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
}

function isImage(mimeType) {
    return mimeType?.startsWith('image/');
}

function isVideo(mimeType) {
    return mimeType?.startsWith('video/');
}

function isAudio(mimeType) {
    return mimeType?.startsWith('audio/');
}

function isDocument(mimeType) {
    return !isImage(mimeType) && !isVideo(mimeType) && !isAudio(mimeType);
}

function getMentionedJids(message) {
    const mentioned = message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    return mentioned;
}

function getQuotedMessage(message) {
    return message?.extendedTextMessage?.contextInfo?.quotedMessage;
}

function getQuotedSender(message) {
    return message?.extendedTextMessage?.contextInfo?.participant;
}

function isGroup(jid) {
    return jid?.endsWith('@g.us');
}

function isPrivate(jid) {
    return jid?.endsWith('@s.whatsapp.net');
}

function getGroupAdmins(sock, jid) {
    try {
        const participants = sock.store?.contacts?.[jid]?.participants || [];
        return participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
    } catch (e) {
        return [];
    }
}

function mentionUser(jid) {
    return `@${jid.split('@')[0]}`;
}

function formatMention(text, jids) {
    return {
        text: text,
        mentions: jids
    };
}

module.exports = {
    createForwardedContext,
    createContextWithButtons,
    isSameUser,
    formatTime,
    getRandomElement,
    cleanText,
    isAdmin,
    isOwner,
    generateId,
    parseTime,
    formatNumber,
    capitalizeFirst,
    truncate,
    sleep,
    getFileSize,
    isUrl,
    extractUrls,
    isImage,
    isVideo,
    isAudio,
    isDocument,
    getMentionedJids,
    getQuotedMessage,
    getQuotedSender,
    isGroup,
    isPrivate,
    getGroupAdmins,
    mentionUser,
    formatMention
};