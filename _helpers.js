/**
 * Utility helper for creating forwarded message context with CTA buttons
 */

const CHANNEL_CODE = '0029VbCFEZv60eBdlqXqQz20';
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCFEZv60eBdlqXqQz20';
const CHANNEL_NAME = 'NEXORA';

/**
 * Creates contextInfo for forwarded message simulation with CTA button
 * @returns {object} contextInfo object for forwarded message
 */
function createForwardedContext() {
    return {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: `${CHANNEL_CODE}@newsletter`,
            newsletterName: CHANNEL_NAME,
            serverMessageId: Math.floor(Math.random() * 1000000)
        },
        buttons: [
            {
                buttonId: "view_channel",
                buttonText: {
                    displayText: "📢 View Channel"
                },
                type: 1
            }
        ]
    };
}

/**
 * Creates contextInfo with CTA button (View Channel)
 * @returns {object} contextInfo with buttons
 */
function createContextWithButtons() {
    return {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: `${CHANNEL_CODE}@newsletter`,
            newsletterName: CHANNEL_NAME,
            serverMessageId: Math.floor(Math.random() * 1000000)
        },
        buttons: [
            {
                buttonId: "view_channel",
                buttonText: {
                    displayText: "📢 View Channel"
                },
                type: 1
            }
        ]
    };
}

/**
 * Creates contextInfo with buttons and quoted message
 * @param {object} msg - Original message to quote
 * @returns {object} contextInfo with buttons
 */
function createContextWithQuotedButton(msg) {
    return {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: `${CHANNEL_CODE}@newsletter`,
            newsletterName: CHANNEL_NAME,
            serverMessageId: Math.floor(Math.random() * 1000000)
        },
        buttons: [
            {
                buttonId: "view_channel",
                buttonText: {
                    displayText: "📢 View Channel"
                },
                type: 1
            }
        ],
        quotedMessage: msg?.message || null,
        participant: msg?.key?.participant || msg?.key?.remoteJid
    };
}

/**
 * Sends a message as if forwarded from a channel
 * @param {object} sock - WhatsApp socket
 * @param {string} from - Chat JID
 * @param {string|object} content - Message content (text or media object)
 * @param {object} msg - Original message to quote
 * @param {string} contentType - Type: 'text', 'image', 'video', etc.
 */
async function sendForwarded(sock, from, content, msg, contentType = 'text') {
    const contextInfo = createContextWithQuotedButton(msg);
    
    const messageObj = {};
    
    if (contentType === 'text') {
        messageObj.text = content;
    } else if (contentType === 'image') {
        messageObj.image = content;
    } else if (contentType === 'video') {
        messageObj.video = content;
    } else if (contentType === 'sticker') {
        messageObj.sticker = content;
    }
    
    messageObj.contextInfo = contextInfo;
    
    await sock.sendMessage(from, messageObj, { quoted: msg });
}

module.exports = {
    createForwardedContext,
    createContextWithButtons,
    createContextWithQuotedButton,
    sendForwarded,
    CHANNEL_CODE,
    CHANNEL_LINK,
    CHANNEL_NAME
};
