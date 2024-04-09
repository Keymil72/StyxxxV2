const moment = require("moment");

const { SlashCommandBuilder } = require("discord.js");
const msgWLIds = require("../../Features/msgWLIds.js");

const Logger = require('../../Features/Logger.js');

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
        msgWLIds.dodaj(id);
        await interaction.reply({ content: `Dodano wiadomosc o id ${id}`, ephemeral: true });
        Logger.log(client, `Dodano wiadomosc o id ${id} do white listy wiadomości przez ${interaction.user.tag}`, "dodaj-id-wiadomosci");
    },
};