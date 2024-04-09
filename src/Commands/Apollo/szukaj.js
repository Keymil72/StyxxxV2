const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');

const { allowedChannelId, spotifyBridge, volume, leaveOnEnd,leaveOnEmpty, } = require('../../apolloConfig.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('szukaj')
        .setDescription('Szuakj utworu')
        .addStringOption(option => option
            .setName('utwor')
            .setDescription('Nazwa utworu do wyszukania')
            .setRequired(true)
        ),

    async execute(interaction) {
        if (interaction.channel.id == allowedChannelId){
            await interaction.deferReply();
            const player = useMainPlayer()

            const song = interaction.options.getString('utwor');

            const res = await player.search(song, {
                requestedBy: interaction.member,
                searchEngine: QueryType.AUTO
            });

            if (!res?.tracks?.length) return interaction.editReply({ content: `Nie odnaleziono utworu ${interaction.member}... ❌`, ephemeral: true });

            const queue = player.nodes.create(interaction.guild, {
                metadata: interaction.channel,
                spotifyBridge: spotifyBridge,
                volume: volume,
                leaveOnEnd: leaveOnEnd,
                leaveOnEmpty: leaveOnEmpty
            });
            const maxTracks = res.tracks.slice(0, 10);

            const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: `Wyniki dla "${song}"`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
            .setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nWybierz pomiędzy **1** a **${maxTracks.length}** lub **c** ⬇️`)
            .setTimestamp()
            .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot', iconURL: interaction.member.avatarURL({ dynamic: true })})

            interaction.editReply({ embeds: [embed] });

            const collector = interaction.channel.createMessageCollector({
                time: 15000,
                max: 1,
                errors: ['time'],
                filter: m => m.author.id === interaction.member.id
            });

            collector.on('collect', async (query) => {
                if (query.content.toLowerCase() === 'c') return interaction.followUp({ content: `Wyszukiwanie anulowane ✅`, ephemeral: true }), collector.stop();

                const value = parseInt(query);
                if (!value || value <= 0 || value > maxTracks.length) return interaction.followUp({ content: `Błędna odpowiedź wybierz pomiędzy **1** a **${maxTracks.length}** lub **c**... ❌`, ephemeral: true });

                collector.stop();

                try {
                    if (!queue.connection) await queue.connect(interaction.member.voice.channel);
                } catch {
                    await player.deleteQueue(interaction.guildId);
                    return interaction.followUp({ content: `Błąd przy dołączaniu do kanału ${interaction.member}... ❌`, ephemeral: true });
                }

                await interaction.followUp(`Wczytywanie wyniku... 🎧`);

                queue.addTrack(res.tracks[query.content - 1]);

                if (!queue.isPlaying()) await queue.node.play();
            });

            collector.on('end', (msg, reason) => {
                if (reason === 'time') return interaction.followUp({ content:`Odpowiedź zajmowała zbyt długo ${interaction.member}... ❌`, ephemeral: true })
            });
        }
    },
};
