const { Events } = require('discord.js');

const path = require('path');
const Logger = require('../../Features/Logger.js');
const Uzytkownik = require('../../Features/Hermes/Uzytkownik.js');

module.exports = {
    // nazwa zdarzenia
    name: Events.MessageCreate,
    // czy zdarzenie ma być wykonane tylko raz czy wielokrotnie
    once: false,
    async execute(message) {
        if (message.author.bot) return;
        if (message.content.startsWith('!setupUsers')) {
            let client = message.client;
            const sendedMessage = await message.channel.send('Rozpoczynam dodawanie użytkowników do bazy danych...');
            Uzytkownik.dodajZCache(client, message.interaction);
            //NOTE - Logger done
            Logger.log(client, `Użytkownik ${message.author.toString()} wykonał polecenie !setupUsers na kanale ${message.channel.toString()}`, `${path.dirname}/${path.basename}`, "control required");
            await sendedMessage.delete();
        }
    },
};