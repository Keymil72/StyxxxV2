const moment = require("moment");

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { channelLogId } = require("../../config.json");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('opusc')
        .setDescription('Wyświetla dostępne komendy')
        .addStringOption(option => option
            .setName('serwer-id')
            .setDescription('Nazwa serwera')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        let client = interaction.client;
        let user = interaction.user;
        let serverId = interaction.options.getString('serwer-id');
        let server = client.guilds.cache.find(guild => guild.id === serverId);
        if (server != null){
            await server.leave();
            await interaction.reply({ content: `STYXXX zawrócił swóje koryto i już nie płynie na ${server.name} na polecenie ${user.toString()}`, ephemeral: true });
            Logger.log(client, `STYXXX zawrócił swóje korytko i już nie płynie na ${server.name} na polecenie ${user.toString()}`, 'info');
        }
    },
};