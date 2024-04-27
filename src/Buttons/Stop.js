const { EmbedBuilder } = require('discord.js');
// moduł eksportuje przycisk zatrzymujący odtwarzanie utworu, czyszczeniu kolejki oraz opuszczaniu kanału głosowego
module.exports = async ({ interaction, queue }) => { 
    // sprawdzenie czy odtwarzam utwór
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    // czyszcezenie kolejki
    queue.delete();

    // embed z informacją o zatrzymaniu Apollo
    const StopEmbed = new EmbedBuilder()
    .setColor('#2f3136')
    .setAuthor({name: `Apollo zatrzymany. Do usłyszenia się wkrótce ✅` })

    // edycja wiadomości na kanale z informacją o zatrzymaniu Apollo
    return interaction.editReply({ embeds: [StopEmbed], ephemeral: true });

}