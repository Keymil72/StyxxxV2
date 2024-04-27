const { EmbedBuilder } = require('discord.js');
// moduł eksportuje przycisk wyświetlający aktualnie odtwarzany utwór - w embedzie na kanala
module.exports = async ({ interaction, queue }) => { 
    // sprawdzenie czy odtwarzam utwór
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    // deklaracja stałych
    const client = interaction.client;
    const track = queue.currentTrack;

    const methods = ['disabled', 'track', 'queue'];

    const timestamp = track.duration;
    
    const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;

    const progress = queue.node.createProgressBar();
    
    // stworzenie embeda z informacjami aktualnie odtwarzanego utworu
    const embed = new EmbedBuilder()
    .setAuthor({ name: `${track.author} - ${track.title}`,  iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
    .setThumbnail(track.thumbnail)
    .setDescription(`Głośność **${queue.node.volume}**%\nDługość **${trackDuration}**\nPostęp ${progress}\nTryb zapętlania **${methods[queue.repeatMode]}**\nWstawione przez ${track.requestedBy}`)
    .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot', iconURL: interaction.member.avatarURL({ dynamic: true })})
    .setColor('ff0000')
    .setTimestamp()
    // edycja embeda na kanale
    await interaction.editReply({ embeds: [embed], ephemeral: true });
}
