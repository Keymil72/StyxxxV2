const { Events } = require('discord.js');

const Logger = require('../../Features/Logger.js');
const { channelTodoId } = require('../../config.json');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.channel.id == channelTodoId) {
            message.delete();
        }
    }
};