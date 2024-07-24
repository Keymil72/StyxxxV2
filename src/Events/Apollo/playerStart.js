const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
module.exports = (queue, track) => {

    const embed = new EmbedBuilder()
    .setAuthor({name: `Odtwarzam utwór ${track.title} na kanale ${queue.channel.name} 🎧`, iconURL: track.thumbnail})
    .setColor('#2f3136')
    queue.metadata.channel.send({ embeds: [embed] });

}
