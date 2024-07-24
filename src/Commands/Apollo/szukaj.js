const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');

const { allowedChannelId, spotifyBridge, volume, leaveOnEnd, leaveOnEmpty, } = require('../../apolloConfig.json');

// moduł eksportuje komendę szukaj
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
        // sprawdzenie czy komenda jest wywołana na odpowiednim kanale
        if (interaction.channel.id == allowedChannelId) {
            // odłożenie odpowiedzi
            await interaction.deferReply();
            // deklaracja stałych 
            const player = useMainPlayer();
            const song = interaction.options.getString('utwor');

            // wyszukanie utworu
            const res = await player.search(song, {
                searchEngine: QueryType.AUTO
            });

            // sprawdzenie czy znaleziono wyniki i wysłanie w informacji w przypadku braku
            if (!res?.tracks?.length) return interaction.editReply({ content: `Nie odnaleziono utworu ${interaction.member}... ❌`, ephemeral: true });

            // stworzenie kolejki
            const queue = player.nodes.create(interaction.guild, {
                metadata: {
                    channel: interaction.channel
                           },
                spotifyBridge: spotifyBridge,
                volume: volume,
                leaveOnEnd: leaveOnEnd,
                leaveOnEmpty: leaveOnEmpty
            });
            // pobranie 10 pierwszych wyników
            const maxTracks = res.tracks.slice(0, 10);

            // stworzenie embeda z informacją o wynikach wyszukiwania utworu (10 pierwszych wyników)
            const embed = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({ name: `Wyniki dla "${song}"`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
                .setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nWybierz pomiędzy **1** a **${maxTracks.length}** lub **c** ⬇️`)
                .setTimestamp()
                .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot', iconURL: interaction.member.avatarURL({ dynamic: true }) })

            // edycja wiadomości na kanale z informacją o wynikach wyszukiwania utworu (10 pierwszych wyników)
            await interaction.editReply({ embeds: [embed] });

            // stworzenie kolektora wiadomości, który czeka na odpowiedź użytkownika z wyborem numeru utworu (aktualnie 15 sec)
            const collector = interaction.channel.createMessageCollector({
                time: 15000,
                max: 1,
                errors: ['time'],
                filter: m => m.author.id === interaction.member.id
            });
            // złapanie odpowiedzi użytkownika
            collector.on('collect', async (query) => {
                // sprawdzenie czy odpowiedź użytkownika jest równa 'c' i zakończenie kolektora
                if (query.content.toLowerCase() === 'c') return interaction.followUp({ content: `Wyszukiwanie anulowane ✅`, ephemeral: true }), collector.stop();

                // sprawdzenie czy odpowiedź użytkownika jest liczbą i czy jest w przedziale od 1 do 10
                const value = parseInt(query);
                if (!value || value <= 0 || value > maxTracks.length) return interaction.followUp({ content: `Błędna odpowiedź wybierz pomiędzy **1** a **${maxTracks.length}** lub **c**... ❌`, ephemeral: true });

                // zakończenie kolektora
                collector.stop();

                // próba połączenia z kanałem głosowym użytkownika i dodanie utworu do kolejki
                try {
                    if (!queue.connection) await queue.connect(interaction.member.voice.channel);
                } catch {
                    // w przypadku błędu usuwamy kolejkę
                    await player.deleteQueue(interaction.guildId);
                    return interaction.followUp({ content: `Błąd przy dołączaniu do kanału ${interaction.member}... ❌`, ephemeral: true });
                }

                // dodanie utworu do kolejki
                await interaction.followUp(`Wczytywanie wyniku... 🎧`);

                // dodanie utworu do kolejki
                queue.addTrack(res.tracks[query.content - 1]);

                // odtworzenie utworu jeśli nie jest odtwarzany
                if (!queue.isPlaying()) await queue.node.play();
            });
            // przy zakończeniu kolektora zwróć informację o zbyt długim czasie odpowiedzi
            collector.on('end', (msg, reason) => {
                if (reason === 'time') return interaction.followUp({ content: `Odpowiedź zajmowała zbyt długo ${interaction.member}... ❌`, ephemeral: true })
            });
        }
    },
};
