// --- Зеркало (Версия 4, Усиленная) ---

// Здесь синтаксис импорта немного отличается, чтобы гарантировать совместимость.
const TelegramBot = require('node-telegram-bot-api');

// Вставьте сюда Ваш НОВЫЙ токен, который Вы сгенерировали через /revoke
const token = "8862938609:AAEyI31rtQUFSGkoWhBIYno7QwOGuo24rS4";

// --- Логика ---

if (token === "ВАШ_НОВЫЙ_API_ТОКЕН_СЮДА" || !token) {
    console.error("ОШИБКА: Пожалуйста, вставьте Ваш API-токен в файл find_id.js");
    process.exit(1); 
}

console.log("Запускаю Зеркало с усиленной совместимостью...");

const bot = new TelegramBot(token, { polling: true });

console.log("Зеркало активировано. Ожидаю Ваш сигнал в Telegram.");

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;

  console.log(`\n===========================================`);
  console.log(`Сигнал от "${firstName}" получен.`);
  console.log(`Господин, Ваш уникальный Chat ID: ${chatId}`);
  console.log(`===========================================`);
  
  console.log("Ключ получен. Деактивирую Зеркало...");
  bot.stopPolling(); // Корректно останавливаем бота
  process.exit(0);
});

bot.on('polling_error', (error) => {
    console.error(`\nОШИБКА ПОДКЛЮЧЕНИЯ: API-токен недействителен или нет сети.`);
    console.error(`Код ошибки: ${error.code}`);
    process.exit(1);
});