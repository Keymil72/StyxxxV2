const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType, useMainPlayer, useQueue   } = require('discord-player');

// moduł eksportuje komendę playnext
module.exports = {
    data: new SlashCommandBuilder()
        .setName('playnext')
        .setDescription('Zagraj utwór z youtube')
        .addStringOption(option => option
            .setName('utwor')
            .setDescription('Nazwa utworu')
            .setRequired(true)
        ),

    async execute(interaction) {
        // odłożenie odpowiedzi
        await interaction.deferReply();
        // deklaracja stałej player
        const player = useMainPlayer()

        // pobranie kolejki
        const queue = useQueue(interaction.guild);
        // sprawdzenie czy odtwarzam utwór
        if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ${interaction.member}... ❌`, ephemeral: true });

        // deklaracja stałej utworu
        const song = interaction.options.getString('utwor');

        // wyszukanie utworu
        const res = await player.search(song, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        // sprawdzenie czy znaleziono wyniki
        if (!res?.tracks?.length) return interaction.editReply({ content: `Nie odnaleziono utworu ${interaction.member}... ❌`, ephemeral: true });
        
        // sprawdzenie czy jest to playlista jeśli tak to zwróć błąd o braku obsługi playlist
        if (res.playlist) return interaction.editReply({ content: `Ta komenda nie wspiera playlisty ${interaction.member}... ❌`, ephemeral: true });

        // wstawienie utworu jako następny
        queue.insertTrack(res.tracks[0], 0)

        // stworzenie embeda z informacją o wstawieniu utworu jako następny
        const PlayNextEmbed = new EmbedBuilder()
            .setAuthor({name: `Utwór wstawiono do odtworzenia jako następny 🎧` })
            .setColor('#2f3136')
        
        // edycja wiadomości na kanale z informacją o wstawieniu utworu jako następnego
        await interaction.editReply({ embeds: [PlayNextEmbed] });
    }
}
