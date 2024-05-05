const { Events } = require('discord.js');

const Cleaner = require('../../Features/Cleaner.js');
const { allowedChannelId } = require('../../apolloConfig.json');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message) {
        if (message.channel.id == allowedChannelId) {
            setTimeout(async () => {
                Cleaner.cleanMessage(message);
            }, 5000);
        }
    },
};