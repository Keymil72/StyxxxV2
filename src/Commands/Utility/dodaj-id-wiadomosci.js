const moment = require("moment");

const { SlashCommandBuilder } = require("discord.js");
const msgWLIds = require("../../Features/msgWLIds.js");

const Logger = require('../../Features/Logger.js');
const DataBase = require('../../Features/DataBase.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dodaj-id-wiadomosci')
        .setDescription('Dodaje ID wiadomości do white listy wiadomości')
        .addStringOption(option => option
            .setName('id')
            .setDescription('ID wiadomości')
            .setRequired(true)
        ),

    async execute(interaction) {
        const client = interaction.client;
        const id = interaction.options.getString('id');
        const message = await interaction.channel.messages.fetch(id);
        if (message){
            msgWLIds.dodaj(message);
            await interaction.reply({ content: `Dodano wiadomosc o id ${id}`, ephemeral: true });
            Logger.log(client, `Dodano wiadomosc o id ${id} do white listy wiadomości przez ${interaction.user.tag}`, "dodaj-id-wiadomosci");
        }else{
            await interaction.reply({ content: `Nie znaleziono wiadomości o id ${id} na kanale ${interaction.channel}`, ephemeral: true });
        }
    },
};