const { EmbedBuilder } = require('discord.js');
const error = require('./error');
module.exports = (queue, error) => {
    const PlayerErrorEmbed = new EmbedBuilder()
    .setAuthor({ name: `Odtwarzacz napotkał nieobsługiwany błąd! - sprawdz logi/konsole`})
    .setColor('#EE4B2B');
    
    queue.metadata.send({ embeds: [PlayerErrorEmbed] });

    console.log(`Odtwarzacz napotkał error: ${error.message}`);
}