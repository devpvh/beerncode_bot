module.exports = (bot) => {
  var lol = (msg) => {
    var chatId = msg.chat.id;

    if(Math.floor(Math.random()*100) > 50) {
      return;
    }

    var respostas = [
      'kkkkkkkkkk',
      'kkkkkkkkkkkkkkkkkkkk',
      'rs',
      'lol',
      'loooool',
      '😂',
      '😂😂😂😂',
      'ahuahUAhuahUAHUAH',
      'hehehehehe'
    ];

    var resposta = respostas.getRandom();

    bot.sendMessage(chatId, resposta, { reply_to_message_id: msg.message_id });
  };

  bot.onText(/(?:kkk|haha|hehe|hau|hueh|hihi)/i, lol);
  bot.onText(/\b(?:lol|lfmao)\b/i, lol);
  bot.onText(/\brs\b/, lol);
};
