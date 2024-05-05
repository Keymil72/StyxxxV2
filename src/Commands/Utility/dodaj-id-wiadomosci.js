const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const msgWLIds = require("../../Features/msgWLIds.js");

const Logger = require('../../Features/Logger.js');

// moduł eksportujący komendę dodającą id wiadomości do white listy
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
            //NOTE - Logger done
            Logger.log(client, `Dodano wiadomosc o id ${id} do white listy wiadomości przez ${interaction.user.tag}`, __filename, 'control required');
        }else{
            // odpowiedź o nie znalezieniu wiadomości
            await interaction.reply({ content: `Nie znaleziono wiadomości o id ${id} na kanale ${interaction.channel}`, ephemeral: true });
        }
    },
};