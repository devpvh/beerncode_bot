'use strict';

var TelegramBot = require('node-telegram-bot-api'),
    token = process.env.BOT_TOKEN || require('../config/token.js'),
    me,
    bot;

if(process.env.NODE_ENV === 'production') {
  bot = new TelegramBot(token);
  var hookUrl = process.env.HEROKU_URL + bot.token;
  bot.setWebHook(hookUrl);
  console.log('Webhook listening at: ' + hookUrl);
}
else {
  bot = new TelegramBot(token, { polling: true });
}

bot.getMe().then((user) => me = user.username);

console.log('bot server started...');


// Colocar os comandos aqui. Cada um no seu arquivo, por favor.
require('../commands/dia-tarde-noite')(bot, me);
require('../commands/horas')(bot, me);
require('../commands/definicao')(bot);
require('../commands/github')(bot);
require('../commands/lol')(bot);
require('../commands/stickers')(bot);


module.exports = bot;
