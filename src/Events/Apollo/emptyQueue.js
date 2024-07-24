const { EmbedBuilder } = require('discord.js');
module.exports = (queue) => {
    const emptyQueue = new EmbedBuilder()
    .setAuthor({ name: `Brak utworów w kolejce!`})
    .setColor('#2f3136');
    
    queue.metadata.channel.send({ embeds: [emptyQueue] });
}