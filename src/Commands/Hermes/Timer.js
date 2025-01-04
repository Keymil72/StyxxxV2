const { SlashCommandBuilder } = require("discord.js");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Ustawia czasomierz na określony czas')
        .addStringOption(option => option
            .setName("time")
            .setDescription('Czasomierz w formacie 3d 4h 5m 6s (d - dni, h - godziny, m - minuty, s - sekundy) można wybrać 1 lub nie podać wcale co symbolizuje minuty')
            .setRequired(true)
        ),

    async execute(interaction) {
        // deklaracja stałych
        const client = interaction.client;
        let stringTime = interaction.options.getString('time');
        await interaction.reply({ content: `Trwa obliczanie przewidywanej daty`, ephemeral: true });
        const currentDateTime = new Date();
        stringTime = stringTime.toLowerCase().replace(/ /g, '');
        const days = stringTime.contains('d') ? parseInt(stringTime.split('d')[0]) : 0;
        const hours = stringTime.contains('h') ? parseInt(stringTime.split('h')[0]) : 0;
        let minutes = stringTime.contains('m') ? parseInt(stringTime.split('m')[0]) : 0;
        const seconds = stringTime.contains('s') ? parseInt(stringTime.split('s')[0]) : 0;
        if (!stringTime.contains("d") && !stringTime.contains("h") && !stringTime.contains("m") && !stringTime.contains("s")) {
            minutes = parseInt(stringTime);
        }
        let stopDateTime = new Date(currentDateTime.prototype.getTime() + (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000));
        if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
            await interaction.editReply({ content: `Nie podałeś czasu lub ma nieprawidłowy format`, ephemeral: true });
            return;
        }
        await interaction.editReply({ content: `Ustawiono timer na ${stopDateTime}`, ephemeral: true });
        Logger.log(client, `Ustawiono timer na ${stopDateTime}`, __filename);
        
        setTimeout(async () => {
            await interaction.editReply({ content: `Timer zakończony`, ephemeral: true });
            Logger.log(client, `Timer zakończony`, __filename);
        }, stopDateTime.prototype.getTime() - currentDateTime.prototype.getTime());
    },
};