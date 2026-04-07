const axios = require("axios");
const { createForwardedContext } = require('./_helpers');

const currencies = {
    usd: { name: "US Dollar", symbol: "$" },
    eur: { name: "Euro", symbol: "Γé¼" },
    gbp: { name: "British Pound", symbol: "┬ú" },
    jpy: { name: "Japanese Yen", symbol: "┬Ñ" },
    cny: { name: "Chinese Yuan", symbol: "┬Ñ" },
    inr: { name: "Indian Rupee", symbol: "Γé╣" },
    krw: { name: "South Korean Won", symbol: "Γé⌐" },
    brl: { name: "Brazilian Real", symbol: "R$" },
    cad: { name: "Canadian Dollar", symbol: "$" },
    aud: { name: "Australian Dollar", symbol: "$" },
    chf: { name: "Swiss Franc", symbol: "Fr" },
    ngn: { name: "Nigerian Naira", symbol: "Γéª" },
    ghs: { name: "Ghanaian Cedi", symbol: "Γé╡" },
    zar: { name: "South African Rand", symbol: "R" },
    mxn: { name: "Mexican Peso", symbol: "$" },
    sgd: { name: "Singapore Dollar", symbol: "$" },
    hkd: { name: "Hong Kong Dollar", symbol: "$" },
    rub: { name: "Russian Ruble", symbol: "Γé╜" },
    try: { name: "Turkish Lira", symbol: "Γé║" },
    php: { name: "Philippine Peso", symbol: "Γé▒" }
};

module.exports = {
    name: "currency",
    aliases: ["convert", "exchange", "money"],
    description: "Convert currencies",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        await sock.sendMessage(from, { react: { text: '≡ƒÆ▒', key: msg.key } });
        
        if (!args.length || args.length < 3) {
            const currencyList = Object.keys(currencies).join(', ').toUpperCase();
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `≡ƒÆ▒ *CURRENCY CONVERTER*\n\nUsage: !currency <amount> <from> <to>\n\nExample:\n!currency 100 USD EUR\n!currency 50 USD NGN\n\nAvailable currencies:\n${currencyList}`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toLowerCase();
        const toCurrency = args[2].toLowerCase();
        
        if (isNaN(amount)) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ¥î Please enter a valid amount.`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        if (!currencies[fromCurrency] || !currencies[toCurrency]) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ¥î Invalid currency code. Use !currency to see available currencies.`,
                contextInfo 
            }, { quoted: msg });
            return;
        }
        
        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.toUpperCase()}`);
            const rate = response.data.rates[toCurrency.toUpperCase()];
            const result = (amount * rate).toFixed(2);
            
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `≡ƒÆ▒ *Currency Conversion*\n\n` +
                      `${currencies[fromCurrency].symbol}${amount} ${currencies[fromCurrency].name}\n\n` +
                      `= ${currencies[toCurrency].symbol}${result} ${currencies[toCurrency].name}\n\n` +
                      `Rate: 1 ${fromCurrency.toUpperCase()} = ${rate} ${toCurrency.toUpperCase()}`,
                contextInfo 
            }, { quoted: msg });
            
        } catch (err) {
            const contextInfo = createForwardedContext();
            await sock.sendMessage(from, { 
                text: `Γ¥î Could not get exchange rate. Please try again later.`,
                contextInfo 
            }, { quoted: msg });
        }
    }
};
