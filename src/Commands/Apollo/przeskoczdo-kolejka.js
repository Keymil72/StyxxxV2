const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('przeskoczdo-kolejka')
        .setDescription('Przeskakuje kolejkę do podanego utworów (2 sposoby)')
        .addStringOption(option => option
            .setName('utwor')
            .setDescription('Nazwa lub link do utworu')
            .setRequired(false)
        )
        .addNumberOption(option => option
            .setName('numer')
            .setDescription('Miejsce w kolejce utworu')
            .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const track = interaction.options.getString('utwor');
        const number = interaction.options.getNumber('numer')

        const queue = useQueue(interaction.guild);

        if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ${interaction.member}... ❌`, ephemeral: true });
        if (!track && !number) interaction.editReply({ content: `Użyj jednej! z dwóch opcji ${interaction.member}... ❌`, ephemeral: true });

        if (track) {
            const track_to_jump = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track)
            if (!track_to_jump) return interaction.editReply({ content: `Nie odnalazłem utworu "${track}" ${interaction.member}... użyj URL lub pełnej nazwy utworu ❌`, ephemeral: true });
            queue.node.jump(track_to_jump);
            return interaction.editReply({ content: `Przeskoczono do utworu ${track_to_jump.title}  ✅` });
        }
        if (number) {
            const index = number - 1
            const trackname = queue.tracks.toArray()[index].title
            if (!trackname) return interaction.editReply({ content: `Czy ten utwór istnieje?! ${interaction.member}... ❌`, ephemeral: true });
        queue.node.jump(index);

        const JumpEmbed = new EmbedBuilder()
            .setAuthor({ name: `Przeskoczono do ${trackname} ✅` })
            .setColor('#2f3136')

        interaction.editReply({ embeds: [JumpEmbed] });
    }

}
}
