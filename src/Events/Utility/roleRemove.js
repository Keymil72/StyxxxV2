const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const Logger = require('../../Features/Logger.js');

const { channelName } = require('../Assets/Role.json');

module.exports = {
    name: Events.MessageReactionRemove,
    once: false,
    async execute(reaction, user) {
        if (user.bot) return;

        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();

        const channel = reaction.message.guild.channels.cache.find(ch => ch.name === channelName);
        if (!channel) return;

        const { message } = reaction;
        const { guild } = message;
        if (!guild || message.channel.id !== channel.id) return;

        const member = reaction.message.guild.members.cache.get(user.id);
        const client = reaction.message.guild.client;

        const filePath = path.join('src', 'events', 'assets', 'Role.json');
        fs.readFile(filePath, 'utf8', (err, file) => {
            if (err) {
                //NOTE - Logger
                Logger.log(client, 'Error while writing the file:' + err, 'error');
                console.error('Error while reading the file:', err);
                return
            }
            try {
                let dataJson = JSON.parse(file)
                dataJson.reaction_role.forEach(async (element) => {
                    if (message.id === element.messageId && reaction.emoji.name === element.emoji) {
                        const role = reaction.message.guild.roles.cache.find(role => role.name === element.role);
                        await member.roles.remove(role);
                        //NOTE - Logger
                        Logger.log(client, `Usunięto role "${role.name}" użytwkownika "${member.user.username}"`);
                    }
                });
            } catch (err) {
                //NOTE - Logger
                Logger.log(client, 'Error podczas zapisywania pliku:' + err, 'error');
                console.error('Error podczas zapisywania pliku:', err);
            }
        });
    }
};