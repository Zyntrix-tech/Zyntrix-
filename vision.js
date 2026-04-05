const axios = require('axios');
const { createForwardedContext } = require('./_helpers');

module.exports = {
  name: 'vision',
  aliases: ['analyze', 'analyzeimage', 'describeimage', 'whatisthis'],
  description: 'Analyze and describe images in detail using AI Vision',
  async execute(sock, msg, args = []) {
    const from = msg.key.remoteJid;
    try {
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quotedMsg) {
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
          text: `🔮 *AI VISION ANALYZER*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n*Usage:* Reply to an image with !vision\n\n*Features:*\n• 📸 Detailed image description\n• 🏷️ Object detection & labeling\n• 🎨 Color and composition analysis\n• 📍 Scene understanding\n• 😊 Emotion detection\n• 🔍 Text extraction from images\n• ⚠️ Content analysis\n\n*Example:*\nReply to any image → !vision\n\n✨ Powered by Google Vision AI`,
          contextInfo
        }, {
          quoted: msg
        });
        return;
      }

      let imageBuffer = null;
      if (quotedMsg.imageMessage) {
        const imageMsg = quotedMsg.imageMessage;
        const imageData = imageMsg.imageData || imageMsg.jpegThumbnail;
        if (imageData) {
          imageBuffer = Buffer.from(imageData, 'binary');
        }
      }

      if (!imageBuffer) {
        const contextInfo = createForwardedContext();
        await sock.sendMessage(from, {
          text: '❌ No image found! Please reply to an image with !vision',
          contextInfo
        }, {
          quoted: msg
        });
        return;
      }

      await sock.sendMessage(from, { react: { text: '🔄', key: msg.key } });

      const OpenAI = require('openai');
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const base64Image = imageBuffer.toString('base64');
      const response = await client.chat.completions.create({
        model: 'gpt-4-vision',
        messages: [
          { role: 'user', content: [
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
              { type: 'text', text: `Analyze this image in detail and provide: 1. **Main Description**: What is the primary subject/scene? 2. **Objects & Elements**: What objects, people, or elements are present? 3. **Colors & Composition**: Describe the color palette and composition 4. **Scene/Location**: Where does this appear to be taken? 5. **Mood & Atmosphere**: What is the mood/vibe of the image? 6. **Text**: Any visible text in the image? 7. **Notable Details**: Any interesting or unusual details? 8. **Quality & Style**: Image quality, photography style, filter applied? Format your response clearly with each section labeled. Be detailed and engaging!` }
            ]
          }]
        , max_tokens: 1024 });

      const analysis = response.choices?.[0]?.message?.content || 'Could not analyze image';
      const contextInfo = createForwardedContext();
      await sock.sendMessage(from, {
        text: `🔮 *AI VISION ANALYSIS*\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n${analysis}\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✨ Powered by GPT-4 Vision`,
        contextInfo
      }, {
        quoted: msg
      });
      await sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
    } catch (err) {
      console.error('Vision command error:', err);
      await sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
      const contextInfo = createForwardedContext();
      await sock.sendMessage(from, {
        text: `❌ *Error Analyzing Image*\n\nPossible issues:\n• Image too large or corrupted\n• Unsupported image format\n• API limit reached\n• API key not configured\n\nPlease try again with a different image.`,
        contextInfo
      }, {
        quoted: msg
      });
    }
  }
};