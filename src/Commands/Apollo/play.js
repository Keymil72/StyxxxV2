const { QueryType, useMainPlayer, useQueue } = require('discord-player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { allowedChannelId, spotifyBridge, volume, leaveOnEnd,leaveOnEmpty, } = require('../../apolloConfig.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Zagraj utwór z youtube')
        .addStringOption(option => option
            .setName('utwor')
            .setDescription('Nazwa utworu')
            .setRequired(true)
        ),

    async execute(interaction) {
        if (interaction.channel.id == allowedChannelId) {
            const player = useMainPlayer()
            const song = interaction.options.getString('utwor');
            await interaction.deferReply();
            const res = await player.search(song, {
                requestedBy: interaction.member,
                searchEngine: QueryType.AUTO
            });
            const NoResultsEmbed = new EmbedBuilder()
                .setAuthor({ name: `Nie odnaleziono takiego utworu ❌` })
                .setColor('#2f3136')

            if (!res?.tracks?.length) return interaction.editReply({ embeds: [NoResultsEmbed] });

            const queue = player.nodes.create(interaction.guild, {
                metadata: interaction.channel,
                spotifyBridge: spotifyBridge,
                volume: volume,
                leaveOnEnd: leaveOnEnd,
                leaveOnEmpty: leaveOnEmpty
            });

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                await player.deleteQueue(interaction.guildId);

                const NoVoiceEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Nie mogłem dołączyć do kanału ❌` })
                    .setColor('#2f3136')

                return interaction.editReply({ embeds: [NoVoiceEmbed] });
            }

            const playEmbed = new EmbedBuilder()
                .setAuthor({ name: `Wczytywanie ${res.playlist ? 'playlisty' : 'Utworu'} do kolejki... ✅` })
                .setColor('#2f3136')

            await interaction.editReply({ embeds: [playEmbed] });


            res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);

            if (!queue.isPlaying()) await queue.node.play();
        } else
            await interaction.reply({ content: `Komenda dostępna tylko na kanale <#${allowedChannelId}>`, ephemeral: true });
    },
};
