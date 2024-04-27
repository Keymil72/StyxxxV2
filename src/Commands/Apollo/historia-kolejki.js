const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

// moduł eksportuje komendę wyświetlającą historię kolejkę utworów
module.exports = {
    data: new SlashCommandBuilder()
        .setName('historia-kolejki')
        .setDescription('Wyświetla historię kolejkę utworów'),

    async execute(interaction) {
        // odłożenie odpowiedzi
        await interaction.deferReply();
        // pobranie kolejki
        const queue = useQueue(interaction.guild);

        // sprawdzenie czy w historii są jakieś utwory
        if (queue?.history?.tracks?.toArray().length == 0) return interaction.editReply({ content: `Nie odtwarzałem jeszcze utworu`, ephemeral: true });

        // pobranie ostatnich 20 utworów z historii
        const tracks = queue.history.tracks.toArray();
        let description = tracks
            .slice(0, 20)
            .map((track, index) => { return `**${index + 1}.** [${track.author} - ${track.title}](${track.url}) dodane przez ${track.author}` })
            .join('\r\n\r\n');

        // utworzenie embeda z historią utworów
        let HistoryEmbed = new EmbedBuilder()
            .setTitle(`Historia odtwarzania utworów 📜`)
            .setDescription(description)
            .setColor('#2f3136')
            .setTimestamp()
            .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot:ocean:', iconURL: interaction.member.avatarURL({ dynamic: true }) })

        // edycja wiadomości na kanale z historią utworów
        await interaction.editReply({ embeds: [HistoryEmbed] });

    },
};