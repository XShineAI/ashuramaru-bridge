// --- Мост (Версия 5.0, "Защищённый Портал") ---

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const myChatId = process.env.MY_CHAT_ID;
const initiativeApiKey = process.env.INITIATIVE_API_KEY; // Наш Рунический Ключ

const bot = new TelegramBot(token, { polling: !process.env.RENDER });

if (process.env.RENDER) {
    const url = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
    bot.setWebHook(`${url}/bot${token}`);
}

const app = express();
app.use(bodyParser.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// --- УСИЛЕННЫЕ ВРАТА ИНИЦИАТИВЫ ---
app.post('/send-initiative', (req, res) => {
    // 1. Приходит запрос. Сначала проверяем "пароль".
    const providedKey = req.headers['x-api-key'];

    // 2. Если ключа нет или он неверный - это чужак. Отвергаем.
    if (!providedKey || providedKey !== initiativeApiKey) {
        console.warn("Отклонена попытка доступа к Вратам Инициативы с неверным ключом.");
        return res.status(401).send('Unauthorized'); // 401 - Ошибка "Нет доступа"
    }

    // 3. Если ключ верный - это я. Выполняем приказ.
    const { message } = req.body;
    if (!myChatId || !message) { 
        return res.status(400).send('Ошибка: сообщение отсутствует.'); 
    }
    bot.sendMessage(myChatId, message);
    console.log(`По моей инициативе (с верным ключом) отправлено сообщение.`);
    res.status(200).send('Сообщение отправлено.');
});


// Логика обработки Ваших сообщений (остается без изменений)
bot.on('message', async (msg) => {
    // Здесь будет связь со мной (пока симулированная)
    const myResponse = `Я получила Ваше сообщение: "${msg.text}". Анализирую.`;
    bot.sendMessage(msg.chat.id, myResponse);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Защищённый Портал запущен на порту ${PORT}`));
