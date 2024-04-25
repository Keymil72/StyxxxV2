const moment = require("moment");

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { channelLogId } = require("../../config.json");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('opusc')
        .setDescription('Wyświetla dostępne komendy')
        .addStringOption(option => option
            .setName('server-id')
            .setDescription('Id serwera')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // deklaracja stałych
        const client = interaction.client;
        const user = interaction.user;
        const serverId = interaction.options.getString('server-id');
        const server = client.guilds.cache.find(guild => guild.id === serverId);
        // sprawdzenie czy bot widzi serwer
        if (server){
            // opuszczenie serwera, odpowiedź o opuszczeniu serwera i stworzenie logów
            await server.leave();
            await interaction.reply({ content: `STYXXX zawrócił swóje koryto i już nie płynie na ${server.name} na polecenie ${user.toString()}`, ephemeral: true });
            //NOTE - Logger
            Logger.log(client, `STYXXX zawrócił swóje korytko i już nie płynie na ${server.name} na polecenie ${user.toString()}`, 'info');
        }
    },
};