const { QueueRepeatMode } = require('discord-player');
module.exports = async ({  interaction, queue }) => { 

    const methods = ['disabled', 'track', 'queue'];

    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    const repeatMode = queue.repeatMode

    if (repeatMode === 0) queue.setRepeatMode( QueueRepeatMode.TRACK)

    if (repeatMode === 1 ) queue.setRepeatMode( QueueRepeatMode.QUEUE)

    if (repeatMode === 2) queue.setRepeatMode( QueueRepeatMode.OFF)
    
    return interaction.editReply({ content: `Zmieniono tryb zapętlania na **${methods[queue.repeatMode]}**.✅`})



}