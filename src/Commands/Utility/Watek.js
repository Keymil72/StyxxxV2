const { SlashCommandBuilder } = require("discord.js");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('watek')
        .setDescription('Obsługuje wątki z zadaniami użytkowników')
        .addSubcommand(subcommand => subcommand
            .setName('usun-osobe')
            .setDescription('Usuwa osobę z twojego wątku'))
        .addMemberOption(option => option
            .setName('osoba')
            .setDescription('Osoba do usunięcia')
            .setRequired(true))
        .addSubcommand(subcommand => subcommand
            .setName('pomoc')
            .setDescription('Pomoc do wątków')),

    async execute(interaction) {
        // deklaracja stałych
        const client = interaction.client;
        const ms = Math.abs(Date.now() - interaction.createdTimestamp);
        // wyświetlenie aktualnego pingu bota
        await interaction.reply({ content: `STYXXX dopłynął z opóźnieniem ${ms}ms.`, ephemeral: true });
        //NOTE - Logger done
        Logger.log(client, `Sprawdzono opóźnienie Styxxx'u - ${ms}ms`, __filename);
    },
};