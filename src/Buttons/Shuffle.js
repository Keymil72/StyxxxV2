const { EmbedBuilder } = require('discord.js');
module.exports = async ({ interaction, queue }) => { 
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    if (!queue.tracks.toArray()[0]) return interaction.editReply({ content: `Brak kolejnych utworów ${interaction.member}... ❌`, ephemeral: true });

        await queue.tracks.shuffle();

        const ShuffleEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({name: `Kolejka prestawiona - ${queue.tracks.size} utworów! ✅` })


       return interaction.editReply({ embeds: [ShuffleEmbed], ephemeral: true});
}