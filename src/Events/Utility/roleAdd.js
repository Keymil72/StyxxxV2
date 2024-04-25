const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const Logger = require('../../Features/Logger.js');

const { channelName } = require('../Assets/Role.json');

module.exports = {
    // nazwa zdarzenia
    name: Events.MessageReactionAdd,
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

        // pobiera użytkownika i klienta
        const member = reaction.message.guild.members.cache.get(user.id);
        const client = reaction.message.guild.client;

        // pobiera ścieżkę do pliku
        const filePath = path.join('src', 'Events', 'Assets', 'Role.json');
        fs.readFile(filePath, 'utf8', (err, file) => {
            if (err) {
                //NOTE - Logger
                Logger.log(client, 'Error while writing the file:' + err);
                console.error('Error while reading the file:', err);
                return
            }
            try {
                let dataJson = JSON.parse(file)
                // sprawdza czy reakcja jest na odpowiednim kanale i czy jest na odpowiedniej wiadomości
                dataJson.reaction_role.forEach(async (element) => {
                    if (message.id === element.messageId && reaction.emoji.name === element.emoji) {
                        const role = reaction.message.guild.roles.cache.find(role => role.name === element.role);
                        await member.roles.add(role);
                        //NOTE - Logger
                        Logger.log(client, `Dodano role "${role.name}" użytkownikowi "${member.user.username}"`);
                    }
                });
            } catch (err) {
                //NOTE - Logger
                Logger.log(client, 'Error while writing the file:' + err, 'error');
            }
        });
    }
};