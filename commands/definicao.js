var request = require('request');
var wikiClient = require('wikipedia-js');

module.exports = (bot) => {

  var doRequest = (msg, matches) => {
    var chatId = msg.chat.id;
    var busca = matches[1].toTitleCase();

    var wikipedia = () => {
      searchTerm('https://pt.wikipedia.org/w/api.php', busca).then(
        (data) => {
          var resposta = 'De acordo com a <b>Wikipedia</b>:\n\n{1}\n\nMais detalhes: {0}'
            .format(data.url, data.excerpt);

          bot.sendMessage(chatId, resposta, { reply_to_message_id: msg.message_id, parse_mode: 'HTML', disable_web_page_preview: true });
        },
        () => {
          console.log('Não encontrado na Wikipedia: %s', busca);
          bot.sendMessage(chatId, 'Sei lá ¯\\_(ツ)_/¯', { reply_to_message_id: msg.message_id, parse_mode: 'HTML', disable_web_page_preview: true })
        }
      );
    };

    var desciclopedia = () => {
      var fallbackToWikipedia = () => {
        console.log('Não encontrado na Desciclopedia: %s', busca);
        wikipedia();
      };
      searchTerm('https://desciclopedia.org/api.php', busca).then(
        (data) => {
          wikiClient.searchArticle(
            {
              query: data.title,
              format: 'html',
              summaryOnly: true,
              apiUrl: 'desciclopedia.org/api.php',
              lang: ''
            },
            (err, response) => {
              if (!err && response) {
                var filter = (/(<p>.{0,4}<strong>(?:.*)<\/p>)/i).exec(response);
                if (filter && filter.length) {
                  console.log(filter);
                  var text = filter[1]
                    .replace(/(<([^>]+)>)/ig, '')
                    .replace(/{{PAGENAME}}/ig, data.title)
                    .replace(/({{([^\}\}]+)}})/ig, '[$2]');

                  var resposta = 'De acordo com a <b>Desciclopedia</b>:\n\n{1}\n\nMais detalhes: https://desciclopedia.org/wiki/{0}'
                    .format(data.title, text.slice(0, getPosition(text, '.', 2) + 1));

                  bot.sendMessage(chatId, resposta, { reply_to_message_id: msg.message_id, parse_mode: 'HTML', disable_web_page_preview: true });
                }
                else {
                  fallbackToWikipedia();
                }
              }
              else {
                fallbackToWikipedia();
              }
            }
          );
        },
        () => fallbackToWikipedia()
      );
    };

    if (Math.random() * 100 > 50) {
      desciclopedia();
    }
    else {
      wikipedia();
    }
  };

  bot.onText(/(?:o )?(?:que|q|quem) (?:é|e(?:h)?|s[aã]o|significa)(?: o| os| a| as| um| uns| uma| umas)? (.*)\?/i, doRequest);
  bot.onText(/qual o significado d[eao][s]? (.*)\?/i, doRequest);
};

function getPosition(str, m, i) {
  return str.split(m, i).join(m).length;
}

function searchTerm(apiUrl, term) {
  var url = '{0}?action=opensearch&suggest=true&redirects=resolve&search={1}'.format(apiUrl, term);
  var q = new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        var data = JSON.parse(body);
        if (!data.length || !data[1].length) {
          reject();
        }
        else {
          var result = {
            title: data[1][0],
            excerpt: data[2][0],
            url: data[3][0]
          };

          resolve(result);
        }
      }
      else {
        reject(error);
      }
    });
  });

  return q;
}
