const Botkit = require('botkit');
const Messenger = require('./messenger');


class Thopter {
  constructor(appId, appPass, debug = false) {
    this.debug = debug;
    this.appId = appId;
    this.appPass = appPass;
    this.controller = this.makeController(appId, appPass, debug);
  }

  makeController(appId, appPass, debug) {
    const controller = Botkit.botframeworkbot({
    });
    var bot = controller.spawn({ appId, appPass });

    controller.setupWebserver(8080,function(err, webserver) {
      controller.createWebhookEndpoints(controller.webserver, bot, function() {
          console.log('This bot is online!!!');
      });
    });

    controller.hears(['hello'], 'message_received', (bot, message) => {
      bot.reply(message, 'Hey there');
    });
    controller.hears(this.patterns, this.messageTypes, (bot, message) => {
      new Messenger(message.match, bot, message);
    });
    return controller;
  }

}

Thopter.prototype.patterns = [
  /\[\[([^\]]+)\]\]/g
];

Thopter.prototype.messageTypes = [
  'ambient',
  'direct_message',
  'direct_mention',
  'mention',
  'message_received'
];

module.exports = Thopter;
