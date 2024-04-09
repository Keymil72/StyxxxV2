const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType, useMainPlayer, useQueue   } = require('discord-player');

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
        await interaction.deferReply();
        const player = useMainPlayer()

const queue = useQueue(interaction.guild);
        if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ${interaction.member}... ❌`, ephemeral: true });

        const song = interaction.options.getString('utwor');

        const res = await player.search(song, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.editReply({ content: `Nie odnaleziono utworu ${interaction.member}... ❌`, ephemeral: true });

       if (res.playlist) return interaction.editReply({ content: `Ta komenda nie wspiera playlisty ${interaction.member}... ❌`, ephemeral: true });

        queue.insertTrack(res.tracks[0], 0)

        const PlayNextEmbed = new EmbedBuilder()
        .setAuthor({name: `Utwór wstawiono do odtworzenia jako następny 🎧` })
        .setColor('#2f3136')
        
        await interaction.editReply({ embeds: [PlayNextEmbed] });


    }
}
