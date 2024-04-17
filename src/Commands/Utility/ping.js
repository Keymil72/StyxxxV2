const moment = require("moment");

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { channelLogId } = require("../../config.json");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Wyświetla aktualny opóźnienie bota'),

    async execute(interaction) {
        // wyświetlenie aktualnego pingu bota
        await interaction.reply({ content: `STYXXX dopłynął z opóźnieniem ${Math.abs(Date.now() - interaction.createdTimestamp)}ms.`, ephemeral: true });

    },
};