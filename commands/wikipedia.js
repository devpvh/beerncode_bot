var request = require('request');

module.exports = function (bot) {
  var wikipedia = function (msg, matches) {
    var chatId = msg.chat.id;
    var busca = matches[1].replace(/ /g, '_');


    var requestPage = function (title) {
      var url = 'https://pt.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles={0}'.format(title);
      request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var data = JSON.parse(body);
          var pages = Object.keys(data.query.pages);

          if (pages.length) {
            var conceito = data.query.pages[pages[0]].extract;
            if (conceito) {
              var resposta = 'De acordo com a <a href="https://pt.wikipedia.org/wiki/{0}">Wikipedia</a>:\n\n{1}\n\nMais detalhes: https://pt.wikipedia.org/wiki/{0}'
                .format(busca, conceito.slice(0, getPosition(conceito, '.', 2) + 1));

              bot.sendMessage(chatId, resposta, { reply_to_message_id: msg.message_id, parse_mode: 'HTML', disable_web_page_preview: true });
            }
          }
        }
        else {
          console.error(body);
        }
      });
    };

    var url = 'https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch={0}&utf8&format=json'.format(busca);
    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var data = JSON.parse(body).query.search;
        if (data.length) {
          requestPage(data[0].title);
        }
      }
    });
  };

  bot.onText(/(?:o )?(?:que|q|quem) (?:é|e(?:h)?|s[aã]o|significa)(?: o| os| a| as| um| uns| uma| umas)? (.*)\?/i, wikipedia);
  bot.onText(/qual o significado d[eao][s]? (.*)\?/i, wikipedia);
};

function getPosition(str, m, i) {
  return str.split(m, i).join(m).length;
}
