const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('historia-kolejki')
        .setDescription('Wyświetla historię kolejkę utworów'),

    async execute(interaction) {
        await interaction.deferReply();
        const queue = useQueue(interaction.guild);

        if (!queue || queue.history.tracks.toArray().length == 0) return interaction.editReply({ content: `Nie odtwarzałem jeszcze utworu`, ephemeral: true });

        const tracks = queue.history.tracks.toArray();
        let description = tracks
            .slice(0, 20)
            .map((track, index) => { return `**${index + 1}.** [${track.author} - ${track.title}](${track.url}) dodane przez ${track.author}` })
            .join('\r\n\r\n');

        let HistoryEmbed = new EmbedBuilder()
            .setTitle(`Historia odtwarzania utworów 📜`)
            .setDescription(description)
            .setColor('#2f3136')
            .setTimestamp()
            .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot:ocean:', iconURL: interaction.member.avatarURL({ dynamic: true }) })


        interaction.editReply({ embeds: [HistoryEmbed] });

    },
};