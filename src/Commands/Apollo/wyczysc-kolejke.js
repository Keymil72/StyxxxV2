const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wyczysc-kolejke')
        .setDescription('Czyści kolejkę utworów'),

    async execute(interaction) {
        await interaction.deferReply();
        const queue = useQueue(interaction.guild);

        if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam utworu ${interaction.member}... ❌`, ephemeral: true });

        if (!queue.tracks.toArray()[1]) return interaction.editReply({ content: `Brak kolejnych utworów ${interaction.member}... ❌`, ephemeral: true });

        await queue.tracks.clear();

        const ClearEmbed = new EmbedBuilder()
            .setAuthor({ name: `Kolejka wyrzucona do 🗑️` })
            .setColor('#2f3136')

        interaction.editReply({ embeds: [ClearEmbed] });

    },
};