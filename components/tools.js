'use strict';
var _ = require('underscore');

var extractMention = module.exports.extractMention = function (text, entity) {
  if (entity.type !== 'mention') {
    console.error('Esta entity não é uma mention');
    return;
  }

  return text.slice(entity.offset, entity.offset + entity.length);
};

module.exports.isTalkingTo = function (msg, who, everyone) {
  var hasMentions = false;
  var mentionsTarget = false;
  var countsEveryone = typeof everyone === 'boolean' ? everyone : true;
  if (msg.entities) {
    _.each(msg.entities, function (entity) {
      if (entity.type === 'mention') {
        hasMentions = true;

        var mention = extractMention(msg.text, entity);
        if ((new RegExp(who, 'i')).exec(mention)) {
          mentionsTarget = true;
        }
      }
    });
  }

  return (hasMentions && mentionsTarget) || (!hasMentions && countsEveryone);
};
