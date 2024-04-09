const { EmbedBuilder } = require('discord.js');
module.exports = async ({ interaction, queue }) => { 
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    queue.delete();

        const StopEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({name: `Apollo zatrzymany. Do usłyszenia się wkrótce ✅` })


       return interaction.editReply({ embeds: [StopEmbed], ephemeral: true });

}