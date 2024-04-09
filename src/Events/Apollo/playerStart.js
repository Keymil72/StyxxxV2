const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
module.exports = (queue, track) => {

    const embed = new EmbedBuilder()
    .setAuthor({name: `Odtwarzam utwór ${track.title} na kanale ${queue.channel.name} 🎧`, iconURL: track.thumbnail})
    .setColor('#2f3136')

    const back = new ButtonBuilder()
    .setLabel('Poprzedni')
    .setCustomId(JSON.stringify({ffb: 'Back'}))
    .setStyle('Primary')

    const skip = new ButtonBuilder()
    .setLabel('Następny')
    .setCustomId(JSON.stringify({ffb: 'Skip'}))
    .setStyle('Primary')

    const ResumePause = new ButtonBuilder()
    .setLabel('pauza / wznow')
    .setCustomId(JSON.stringify({ffb: 'ResumePause'}))
    .setStyle('Danger')

    const loop = new ButtonBuilder()
    .setLabel('Zapetlij')
    .setCustomId(JSON.stringify({ffb: 'Loop'}))
    .setStyle('Secondary')
    
    const lyrics = new ButtonBuilder()
    .setLabel('Tekst')
    .setCustomId(JSON.stringify({ffb: 'Lyrics'}))
    .setStyle('Secondary')

    const row1 = new ActionRowBuilder().addComponents(back, loop, ResumePause, lyrics, skip);
    queue.metadata.send({ embeds: [embed] });

}
