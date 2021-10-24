const { VK } = require('vk-io');
const { token } = require('./config');
const moderation = require('./functions/moderation');

const vk = new VK({ token, language: 'ru' });

vk.updates.start()
  .then(() => {
    vk.updates.on('message', (...args) => moderation.init(...args, vk));

    console.info('[BOT] has been started');
  })
  .catch(console.error);
