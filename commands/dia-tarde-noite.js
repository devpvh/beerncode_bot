var moment = require('moment'),
  tools = require('../components/tools.js');

module.exports = (bot, me) => {
  bot.onText(/(bo[am] ((?:dia|tarde|noite)))/i, (msg, matches) => {
    if (!tools.isTalkingTo(msg, me)) {
      return;
    }

    var chatId = msg.chat.id;
    var respostas = [
      'Opa, {x}!',
      '{X}, {0}!'.format(msg.from.first_name),
      '{X} pra você também, {0}!'.format(msg.from.first_name),
      'Tenha {y} {x} também! 😃',
      'Realmente é {y} {x}!'
    ];

    var resposta = respostas.getRandom();

    var x = matches[1];
    var y = matches[2] === 'noite' ? 'uma' : 'um';

    resposta = resposta.replace('{x}', x.toLowerCase());
    resposta = resposta.replace('{X}', x.toFirstLetterUpperCase());
    resposta = resposta.replace('{y}', y);

    var hora = moment().utcOffset('-04:00');

    var compHora = parseInt(hora.format('HMM'), 10);
    var compMsg = matches[2].toLowerCase();
    var adverbio;

    var outOfTime = false;

    if(compMsg === 'noite') {
      if(compHora < 1830 && compHora > 600) {
        outOfTime = true;
        adverbio = 'ainda';
      }
      else if(compHora > 300 && compHora < 600) {
        outOfTime = true;
        adverbio = 'já';
      }
    }
    else if(compMsg === 'dia') {
      if(compHora < 300) {
        outOfTime = true;
        adverbio = 'ainda';
      }
      else if(compHora > 1200) {
        outOfTime = true;
        adverbio = 'já';
      }
    }
    else if(compMsg === 'tarde') {
      if(compHora < 1200) {
        outOfTime = true;
        adverbio = 'ainda';
      }
      else if(compHora > 1900) {
        outOfTime = true;
        adverbio = 'já';
      }
    }

    if(outOfTime) {
      resposta = '{1}? Nós estamos em Porto Velho! {2} são {0} 😛'.format(hora.format('HH:mm'), x.toFirstLetterUpperCase(), adverbio.toFirstLetterUpperCase());
    }

    bot.sendMessage(chatId, resposta, { reply_to_message_id: msg.message_id });
  });
};
