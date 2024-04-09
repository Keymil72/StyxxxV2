const { EmbedBuilder } = require('discord.js');
module.exports = (queue, track) => {
    const audioTrackAdd = new EmbedBuilder()
    .setAuthor({ name: `Utwór ${track.title} został dodany do kolejki`, iconURL: track.thumbnail})
    .setColor('#2f3136')

    queue.metadata.send({ embeds: [audioTrackAdd]});
}