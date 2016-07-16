var moment = require('moment'),
tools = require('../components/tools.js');

module.exports = function (bot, me) {
  bot.onText(/que horas são/i, function (msg) {
    var chatId = msg.chat.id;

    if (!tools.isTalkingTo(msg, me)) {
      return;
    }

    var hora = moment()
      .utcOffset('-04:00')
      .format('HH:mm:ss');

    var respostas = [
      'Eu sei! São {0}.'.format(hora),
      'São exatamente {0}.'.format(hora),
      'O Beer && Code informa a hora certa. São {0}.'.format(hora),
      'É hora de olhar no relógio do seu computador 😃'
    ];


    var resposta = respostas.getRandom();
    bot.sendMessage(chatId, resposta, { reply_to_message_id: msg.message_id });
  });
};
