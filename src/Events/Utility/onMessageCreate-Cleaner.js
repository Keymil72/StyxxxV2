const { Events } = require('discord.js');
const moment = require('moment');

const Logger = require('../../Features/Logger.js');
const Cleaner = require('../../Features/Cleaner.js');
const { developmentMode } = require('../../config.json');
const { allowedChannelId } = require('../../apolloConfig.json');
const { ids } = require('../Assets/msgWl.json');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message) {
        if (message.channel.id == allowedChannelId) {
            setTimeout(async () => {
                if (!ids.includes(message.id)) {
                    Cleaner.cleanMessage(message);
                }
            }, 5000);
        }
    },
};