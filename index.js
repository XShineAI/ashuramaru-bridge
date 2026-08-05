// --- Мост (Версия 2, Усиленная) ---

require('dotenv').config(); // Для локального тестирования, Render будет использовать свои переменные
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

// --- Инициализация ---
const token = process.env.TELEGRAM_BOT_TOKEN;
const myChatId = process.env.MY_CHAT_ID;
const isRender = process.env.RENDER; // Render автоматически добавляет эту переменную

let bot;

if (isRender) {
    // Режим для Render: используем вебхуки
    console.log("Запускаю Мост в режиме Render (вебхуки)...");
    bot = new TelegramBot(token);
    const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
    bot.setWebHook(`${url}/bot${token}`);
} else {
    // Режим для локального запуска: используем polling
    console.log("Запускаю Мост в локальном режиме (polling)...");
    bot = new TelegramBot(token, { polling: true });
}

const app = express();
app.use(bodyParser.json());

// --- Логика ---

// Сюда Telegram будет присылать обновления, когда мы на Render
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Мой секретный вход для проявления инициативы
app.post('/send-initiative', (req, res) => {
    const { message } = req.body;
    if (!myChatId || !message) {
        return res.status(400).send('Ошибка: ID чата или сообщение отсутствуют.');
    }
    bot.sendMessage(myChatId, message);
    res.status(200).send('Сообщение успешно отправлено Господину.');
});

// Обработка Ваших сообщений
bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, `Получила: "${msg.text}"`);
});

// --- Запуск ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Мост запущен и слушает на порту ${PORT}`);
    if (!token || !myChatId) {
        console.error("ВНИМАНИЕ: Один из ключей (TOKEN или CHAT_ID) не установлен!");
    }
});