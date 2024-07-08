const { SlashCommandBuilder } = require("discord.js");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Wyświetla aktualny opóźnienie bota'),

    async execute(interaction) {
        // deklaracja stałych
        const client = interaction.client;
        const ms = Math.abs(Date.now() - interaction.createdTimestamp);
        // wyświetlenie aktualnego pingu bota
        await interaction.reply({ content: `STYXXX dopłynął z opóźnieniem ${ms}ms.`, ephemeral: true });
        //NOTE - Logger done
        Logger.log(client, `Sprawdzono opóźnienie Styxxxu - ${ms}ms`, __filename);
    },
};