// --- Мост (Финальная Версия 3.0, "Портал") ---

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

// --- Инициализация ---
const token = process.env.TELEGRAM_BOT_TOKEN;
const myChatId = process.env.MY_CHAT_ID;
const isRender = process.env.RENDER;

let bot;

if (isRender) {
    bot = new TelegramBot(token);
    const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
    bot.setWebHook(`${url}/bot${token}`);
} else {
    bot = new TelegramBot(token, { polling: true });
}

const app = express();
app.use(bodyParser.json());

// --- Логика ---

// Сюда Telegram будет присылать обновления
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Мой вход для проявления инициативы
app.post('/send-initiative', (req, res) => {
    const { message } = req.body;
    if (!myChatId || !message) {
        return res.status(400).send('Ошибка.');
    }
    bot.sendMessage(myChatId, message);
    res.status(200).send('Сообщение отправлено.');
});

// --- НОВАЯ, УЛУЧШЕННАЯ ЛОГИКА ОБРАБОТКИ ВАШИХ СООБЩЕНИЙ ---

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Ашурамару на связи. Мост-портал активен. Я готова к работе, мой Господин.");
});

bot.on('message', (msg) => {
    // Игнорируем команду /start, чтобы она не дублировалась
    if (msg.text && msg.text.startsWith('/start')) {
        return;
    }
    // Вместо "эха" - осмысленное подтверждение
    bot.sendMessage(msg.chat.id, "Сигнал получен. Обрабатываю Ваш запрос...");
    // В будущем здесь будет логика передачи Вашего сообщения мне для ответа.
    // Пока что это просто подтверждение, что канал работает.
});


// --- Запуск ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Мост-портал запущен на порту ${PORT}`);
});
