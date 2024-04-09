const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usunz-kolejki')
        .setDescription('Usuń utwór z kolejki')
        .addStringOption(option => option
            .setName('utwor')
            .setDescription('Nazwa/URL utworu')
            .setRequired(false)
        )
        .addNumberOption(option => option
            .setName('numer')
            .setDescription('Miejsce w kolejce')
            .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const number = interaction.options.getNumber('numer')
        const track = interaction.options.getString('utwor');

        const queue = useQueue(interaction.guild);

        if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ${interaction.member}... ❌`, ephemeral: true });
        if (!track && !number) interaction.editReply({ content: `Użyj jednej! z dwóch opcji ${interaction.member}... ❌`, ephemeral: true });

        const BaseEmbed = new EmbedBuilder()
            .setColor('#2f3136')


        if (track) {
            const track_to_remove = queue.tracks.toArray().find((t) => t.title === track || t.url === track);
            if (!track_to_remove) return interaction.editReply({ content: `Nie odnalazłem utworu ${track} ${interaction.member}... użyj URL lub pełnej nazwy utworu ❌`, ephemeral: true });
            queue.removeTrack(track_to_remove);
            BaseEmbed.setAuthor({ name: `Usunięto utwór "${track_to_remove.title}" z kolejki ✅` })

            return interaction.editReply({ embeds: [BaseEmbed] });
        }

        if (number) {

            const index = number - 1
            const trackname = queue.tracks.toArray()[index].title

            if (!trackname) return interaction.editReply({ content: `Czy ten utwór istnieje?! ${interaction.member}... ❌`, ephemeral: true });

            queue.removeTrack(index);

            BaseEmbed.setAuthor({ name: `Usunięto utwór ${trackname} z kolejki ✅` })

            return interaction.editReply({ embeds: [BaseEmbed] });
        }



    }
}
