const { EmbedBuilder } = require('discord.js');
// moduł eksportuje przycisk przetasowania kolejki
module.exports = async ({ interaction, queue }) => {
    // sprawdzenie czy odtwarzam utwór 
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    
    // sprawdzenie czy w kolejce są jakieś utwory
    if (!queue.tracks?.toArray()[0]) return interaction.editReply({ content: `Brak kolejnych utworów ${interaction.member}... ❌`, ephemeral: true });
    
    // przetasowanie kolejki
    await queue.tracks.shuffle();
    // informacja o przetasowaniu kolejki
    const ShuffleEmbed = new EmbedBuilder()
    .setColor('#2f3136')
    .setAuthor({name: `Kolejka prestawiona - ${queue.tracks.size} utworów! ✅` })

    // edycja wiadomości na kanale z informacją o przetasowaniu kolejki
    return interaction.editReply({ embeds: [ShuffleEmbed], ephemeral: true});
}