var GitHubApi = require('node-github'),
  moment = require('moment');

module.exports = function (bot) {

  bot.onText(/(http|ftp|https):\/\/(github)+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/i, function (msg, matches) {
    var chatId = msg.chat.id,
      msgGitHub = matches[4].split('/');

    var github = new GitHubApi({
      version: '3.0.0',
      debug: false,
      protocol: 'https',
      host: 'api.github.com',
      followRedirects: false,
      timeout: 5000
    });

    github.repos.get(
      {
        user: msgGitHub[1],
        repo: msgGitHub[2]

      },
      function (error, response) {
        if (!response) {
          bot.sendMessage(chatId, 'Não achei esse repositório... Tem certeza que ele existe? 😅', { reply_to_message_id: msg.message_id });

        }
        else {
          var criadoEm = moment(response.created_at)
            .utcOffset('-04:00')
            .format('DD/MM/YY');

          var atualizadoEm = moment(response.pushed_at)
            .utcOffset('-04:00')
            .format('DD/MM/YY');

          var mensagem = '<b>{0}</b>\n{1}\n\n';

          if (response.language) {
            mensagem = mensagem.concat('Foi feito utilizando <b>{2}</b>. ');
          }

          mensagem = mensagem.concat('O desenvolvimento começou em <b>{3}</b> e o último commmit foi em <b>{4}</b>.')
            .format(
            response.name,
            response.description ? response.description : 'Os caras não fizeram uma descrição pro projeto.',
            response.language,
            criadoEm,
            atualizadoEm
            );

          bot.sendMessage(chatId, mensagem, { reply_to_message_id: msg.message_id, parse_mode: 'HTML' });
        }
      }
    );
  });
};
