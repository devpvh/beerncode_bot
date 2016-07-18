var db = require('mongodb').MongoClient,
  dburi = process.env.MONGODB_URI || require('../config/db'),
  MAX_PER_EMOJI = 10;

module.exports = (bot) => {

  var learnSticker = (msg) => {
    db.connect(dburi, (err, conn) => {
      if (err) {
        console.log(err);
        conn.close();
        return;
      }

      var data = { 'emoji': msg.sticker.emoji, 'fileId': msg.sticker.file_id };

      var stickers = conn.collection('stickers');
      stickers.count({ 'emoji': data.emoji }, (cntErr, count) => {
        if (cntErr) {
          console.error(cntErr);
          return;
        }

        if (count >= MAX_PER_EMOJI) {
          conn.close();
          return;
        }

        stickers.findOne(data, (findErr, item) => {
          if (findErr) {
            console.error(findErr);
            conn.close();
            return;
          }

          if (!item) {
            data.timesRead = 0;
            data.timesWritten = 0;

            stickers.insert(data, (insErr) => {
              if (insErr) {
                console.error(insErr);
              }
              conn.close();
            });
          }
          else {
            conn.close();
          }
        });
      });
    });
  };

  var useSticker = (msg) => {
    console.log(msg);
    var chatId = msg.chat.id;

    db.connect(dburi, (err, conn) => {
      if (err) {
        console.log(err);
        conn.close();
        return;
      }

      var stickers = conn.collection('stickers');
      stickers
        .find({ emoji: msg.text })
        .toArray((findErr, items) => {
          if(findErr){
            console.error(findErr);
          }
          else if (items.length) {
            var sticker = items.getRandom();
            bot.sendSticker(chatId, sticker.fileId, { reply_to_message_id: msg.message_id });
          }
          conn.close();
        });
    });
  };

  bot.on('sticker', learnSticker);
  bot.onText(/^.{1,2}$/i, useSticker);
};
