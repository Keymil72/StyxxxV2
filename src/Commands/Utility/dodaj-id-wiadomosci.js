// dokończyć i przetestować i usunąć json z id wiadomości
const moment = require("moment");

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const msgWLIds = require("../../Features/msgWLIds.js");

const Logger = require('../../Features/Logger.js');
// dodać obsługę bazy danych
const DataBase = require('../../Features/DataBase.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dodaj-id-wiadomosci')
        .setDescription('Dodaje ID wiadomości do white listy wiadomości')
        .addStringOption(option => option
            .setName('id')
            .setDescription('ID wiadomości')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // deklaracja stałych
        const client = interaction.client;
        const id = interaction.options.getString('id');
        const message = await interaction.channel.messages.fetch(id);
        // sprawdzenie czy wiadomość istnieje
        if (message){
            // wywołanie funkcji dodającej id wiadomości do white listy
            msgWLIds.dodaj(message);
            // odpowiedź o dodaniu wiadomości do white listy i stworzenie logów
            await interaction.reply({ content: `Dodano wiadomosc o id ${id}`, ephemeral: true });
            Logger.log(client, `Dodano wiadomosc o id ${id} do white listy wiadomości przez ${interaction.user.tag}`, "dodaj-id-wiadomosci");
        }else{
            // odpowiedź o nie znalezieniu wiadomości
            await interaction.reply({ content: `Nie znaleziono wiadomości o id ${id} na kanale ${interaction.channel}`, ephemeral: true });
        }
    },
};