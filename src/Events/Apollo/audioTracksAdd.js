const { EmbedBuilder } = require('discord.js');

module.exports = (queue) => {
    const audioTracksAdd = new EmbedBuilder()
    .setAuthor({ name: `Dodano wszystkie utwory z playlisty do kolejki`, })
    .setColor('#2f3136')
    
    queue.metadata.channel.send({ embeds: [audioTracksAdd] });
}