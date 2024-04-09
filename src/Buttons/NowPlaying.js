const { EmbedBuilder } = require('discord.js');
module.exports = async ({ interaction, queue }) => { 
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    const client = interaction.client;
    const track = queue.currentTrack;

    const methods = ['disabled', 'track', 'queue'];

    const timestamp = track.duration;
    
    const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;

    const progress = queue.node.createProgressBar();
    

    const embed = new EmbedBuilder()
    .setAuthor({ name: `${track.author} - ${track.title}`,  iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
    .setThumbnail(track.thumbnail)
    .setDescription(`Głośność **${queue.node.volume}**%\nDługość **${trackDuration}**\nPostęp ${progress}\nTryb zapętlania **${methods[queue.repeatMode]}**\nWstawione przez ${track.requestedBy}`)
    .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot', iconURL: interaction.member.avatarURL({ dynamic: true })})
    .setColor('ff0000')
    .setTimestamp()

    interaction.editReply({ embeds: [embed], ephemeral: true });
}
