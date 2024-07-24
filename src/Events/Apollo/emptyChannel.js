const { EmbedBuilder } = require('discord.js');
module.exports = (queue) => {
    const emptyChannel = new EmbedBuilder()
    .setAuthor({ name: `Kanał jest pusty - rozłączam z kanału`})
    .setColor('#2f3136');
    
    queue.metadata.channel.send({ embeds: [emptyChannel] });
}