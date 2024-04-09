const { Events } = require('discord.js');

const Uzytkownik = require('../../Features/Hermes/Uzytkownik.js');
const Logger = require('../../Features/Logger.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,
    execute(oldVoiceState, newVoiceState) {
        if (oldVoiceState.channel == null && newVoiceState.channel != null) {
            //Uzytkownik.dodaj(newVoiceState.client, newVoiceState.member);
        }
    }
};
