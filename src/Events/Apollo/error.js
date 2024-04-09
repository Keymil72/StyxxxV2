const { EmbedBuilder } = require('discord.js');
module.exports = (queue, error) => {
    const ErrorEmbed = new EmbedBuilder()
    .setAuthor({ name: `Nieobsługiwany błąd - sprawdz logi/konsole`})
    .setColor('#EE4B2B');
    
    queue.metadata.send({ embeds: [ErrorEmbed] });

    console.log(`Error bota: ${error.message}`);
}