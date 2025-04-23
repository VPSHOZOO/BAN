const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your Telegram bot token
const token = '7252116522:AAHJlPUkFJJHjN3AufQ6jh6Zm1BIIN1RHLA';
const bot = new TelegramBot(token, {polling: true});

// Store user states
const userStates = {};

// Menu buttons
const mainMenu = {
    reply_markup: {
        keyboard: [
            [{text: 'Ban Number'}],
            [{text: 'Help'}]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    }
};

// Function to fetch the resource
async function fetchResource(chatId, bannedNumber) {
    const url = "https://static.whatsapp.net/rsrc.php/v4/yR/r/ERz6pNGhHp8.js";
    
    const headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://faq.whatsapp.com",
        "Priority": "u=1",
        "Referer": "https://faq.whatsapp.com/",
        "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        "Sec-Fetch-Dest": "script",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    };

    try {
        const response = await axios.get(url, { headers });
        bot.sendMessage(chatId, `Resource fetched successfully:\n${response.data.substring(0, 100)}...`); // Showing first 100 chars
        bot.sendMessage(chatId, `Target number banned: ${bannedNumber}`);
    } catch (error) {
        bot.sendMessage(chatId, `Error fetching resource: ${error.message}`);
    }
}

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to banned wa hacked lordhozoo 2025', mainMenu);
});

// Handle text messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (userStates[chatId] === 'awaiting_number') {
        // User has sent the number to ban
        const bannedNumber = text;
        userStates[chatId] = undefined; // Reset state
        fetchResource(chatId, bannedNumber);
    } else if (text === 'Ban Number') {
        userStates[chatId] = 'awaiting_number';
        bot.sendMessage(chatId, 'Masukkan nomor (contoh: +62XXXXXXXXXX):', {
            reply_markup: {
                remove_keyboard: true
            }
        });
    } else if (text === 'Help') {
        bot.sendMessage(chatId, 'This bot helps you ban numbers. Click "Ban Number" and follow the instructions.');
    }
});

console.log('Bot is running...');
