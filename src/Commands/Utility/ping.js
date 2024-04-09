const moment = require("moment");

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { channelLogId } = require("../../config.json");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Wyświetla dostępne komendy'),

    async execute(interaction) {
        const client = interaction.client;
        await interaction.reply({ content: `STYXXX dopłynął z opóźnieniem ${Date.now() - interaction.createdTimestamp}ms.`, ephemeral: true });

    },
};