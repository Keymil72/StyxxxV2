// FIXME dokończyć
const { SlashCommandBuilder } = require("discord.js");

const DataBase = require('../../Features/DataBase.js');
const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('watek')
        .setDescription('Obsługuje wątki z zadaniami użytkowników')
        .addSubcommand(subcommand => subcommand
            .setName('usun-osobe')
            .setDescription('Usuwa osobę z twojego wątku')
            .addUserOption(option => option
                .setName('osoba')
                .setDescription('Osoba do usunięcia')
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('pomoc')
            .setDescription('Pomoc do wątków')),

    async execute(interaction) {
        // deklaracja stałych
        const client = interaction.client;
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'usun-osobe':
                removeUser(interaction);
                break;
            case 'pomoc':
                //NOTE - Logger done
                Logger.log(client, `Użytkownik ${owner.username} próbuje uzyskać pomoc w wątkach`, __filename);
                break;
        }
    },
};

async function removeUser(interaction) {
    const owner = interaction.user;
    const target = interaction.options.getUser('osoba');
    const channel = interaction.channel;
    let query = `SELECT watekId FROM StyxxxDcBot.Uzytkownicy WHERE uzytkownikId = ${owner.id}`;
    if (target.id == interaction.client.application.id) {
        await interaction.reply({ content: "Czy ty próbujesz wyrzucić Hermesa?!", ephemeral: true });
        return;
    } else if (target.id == owner.id) {
        await interaction.reply({ content: "Czy ty próbujesz sam się wyrzucić?!", ephemeral: true });
        return;
    }
    //NOTE - Logger done
    Logger.log(client, `Użytkownik ${owner.username} próbuje usunąć osobę ${target.username} z wątku`, __filename);

    DataBase.polacz(query, interaction, async (result) => {
        if (channel.id == result[0].watekId) {
            //TODO - Przepiąć na features/Watek.usun...
            await interaction.reply({ content: `Wyrzucono użytkownika ${target.displayName} z twojego wątku`, ephemeral: true });
        }
    });
}