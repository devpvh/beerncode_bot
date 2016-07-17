'use strict';

var bot = require('./components/bot');
require('./components/web')(bot);

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = () => {
    var args = arguments;
    return this.replace(/{(\d+)}/g, (match, number) => (typeof args[number] !== 'undefined' ? args[number] : match));
  };
}

if (!String.prototype.toFirstLetterUpperCase) {
  String.prototype.toFirstLetterUpperCase = () => {
    var firstLetter = this.charAt(0);
    firstLetter = firstLetter.toUpperCase();

    var rest = this.slice(1);
    var response = firstLetter.concat(rest);

    return response;
  };
}

if (!String.prototype.toTitleCase) {
  String.prototype.toTitleCase = () => this
    .toLowerCase()
    .split(' ')
    .map((i) => i[0].toUpperCase() + i.substring(1))
    .join(' ');
}

// Pega um elemento aleatório de um array
if (!Array.prototype.getRandom) {
  Array.prototype.getRandom = () => this[Math.floor(Math.random() * this.length)];
}
