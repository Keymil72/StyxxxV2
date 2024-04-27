const ms = require('ms');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue  } = require('discord-player');

// moduł eksportuje komendę przeskoczdo-czas
module.exports = {
    data: new SlashCommandBuilder()
        .setName('przeskoczdo-czas')
        .setDescription('Czas do przeskoczenia w utworze')
        .addStringOption(option => option
            .setName('czas')
            .setDescription('Czas np. 5s, 10s, 20s, 1m, 7m')
            .setRequired(true)
        ),
    async execute(interaction) {
        // odłożenie odpowiedzi
        await interaction.deferReply();

        // pobranie kolejki
        const queue = useQueue(interaction.guild);

        // sprawdzenie czy odtwarzam utwór
        if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ${interaction.editReply}... ❌`, ephemeral: true });

        // deklaracja stałej czasu
        const timeToMS = ms(interaction.options.getString('czas'));

        // sprawdzenie czy czas jest większy niż długość utworu i zwrócenie błędu
        if (timeToMS >= queue.currentTrack.durationMS) return interaction.editReply({ content:`Podany czas przekroczył długość utworu ${interaction.member}... ❌\nUżyj np. 5s, 10s, 20s, 1m, 7m`, ephemeral: true });

        // przeskoczenie do czasu w utworze
        await queue.node.seek(timeToMS);

        // stworzenie embeda z informacją o przeskoczeniu do czasu w utworze
        const SeekEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({name: `Ustawiono moment odtwarzania akutalnego utworu na ${ms(timeToMS, { long: true })} ✅`})

        // edycja wiadomości na kanale z informacją o przeskoczeniu do czasu w utworze
        await interaction.editReply({ embeds: [SeekEmbed] });
    },
};