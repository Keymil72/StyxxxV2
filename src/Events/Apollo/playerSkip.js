const { EmbedBuilder } = require('discord.js');
module.exports = (queue, track) => {
    const playerSkip = new EmbedBuilder()
    .setAuthor({ name: `Pomijam utwór "${track.title}"`, iconURL: track.thumbnail })
    .setColor('#EE4B2B');
    
    queue.metadata.send({ embeds: [playerSkip] });
}