const { QueryType, useMainPlayer } = require('discord-player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { allowedChannelId, leaveOnEmptyCooldown, leaveOnEndCooldown, volume, leaveOnEnd,leaveOnEmpty, } = require('../../apolloConfig.json');
// moduł eksportuje komendę play
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
        // sprawdzenie czy komenda jest wywołana na odpowiednim kanale
        if (interaction.channel.id == allowedChannelId) {
            // deklaracja stałych
            const player = useMainPlayer();
            const song = interaction.options.getString('utwor');
            // odłożenie odpowiedzi
            await interaction.deferReply();
            // wyszukanie utworu
            const res = await player.search(song, {
                searchEngine: QueryType.AUTO
            });
            // stworzenie embeda z informacją o braku wyników
            const NoResultsEmbed = new EmbedBuilder()
                .setAuthor({ name: `Nie odnaleziono takiego utworu ❌` })
                .setColor('#2f3136')

            // sprawdzenie czy znaleziono wyniki i wysłanie w informacji w przypadku braku
            if (!res?.tracks?.length) return interaction.editReply({ embeds: [NoResultsEmbed] });


            // próba połączenia z kanałem głosowym użytkownika i dodanie utworu lub playlisty do klejki
            try {
                await player.play(interaction.member.voice.channel, song, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel
                        },
                        volume: volume,
                        leaveOnEnd: leaveOnEnd,
                        leaveOnEndCooldown: leaveOnEndCooldown,
                        leaveOnEmpty: leaveOnEmpty,
                        leaveOnEmptyCooldown: leaveOnEmptyCooldown
                    }
                });
                // stworzenie embeda z informacją o dodaniu utworu do kolejki
                const playEmbed = new EmbedBuilder()
                .setAuthor({ name: `Wczytywanie ${res?.hasPlaylist() ? 'playlisty' : 'Utworu'} do kolejki... ✅` })
                .setColor('#2f3136')
                // edycja wiadomości na kanale z informacją o dodaniu utworu do kolejki
                await interaction.editReply({ embeds: [playEmbed] });
            } catch {
                // stworzenie embeda z informacją o błędzie
                const NoVoiceEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Nie mogłem dołączyć do kanału ❌` })
                    .setColor('#2f3136')
                // wysłanie informacji o błędzie
                return interaction.editReply({ embeds: [NoVoiceEmbed] });
            }
        } else
            // informacja o braku dostępu do komendy na kanale
            await interaction.reply({ content: `Komenda dostępna tylko na kanale <#${allowedChannelId}>`, ephemeral: true });
    },
};
