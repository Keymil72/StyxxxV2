const { QueueRepeatMode } = require('discord-player');
// moduł eksportuje przycisk zmieniający tryb zapętlania utworów
module.exports = async ({ interaction, queue }) => {
    // deklaracje stałych trybów zapętlania
    const methods = ['disabled', 'track', 'queue'];

    // sprawdza czy bot odtwarza utwór
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    
    // pobranie aktualnego trybu zapętlania
    const repeatMode = queue.repeatMode

    // zmiana trybu zapętlania
    if (repeatMode === 0) queue.setRepeatMode(QueueRepeatMode.TRACK)

    // zmiana trybu zapętlania
    if (repeatMode === 1) queue.setRepeatMode(QueueRepeatMode.QUEUE)
    
    // zmiana trybu zapętlania
    if (repeatMode === 2) queue.setRepeatMode(QueueRepeatMode.OFF)
    
    // zwraca informację o zmianie trybu zapętlania
    return interaction.editReply({ content: `Zmieniono tryb zapętlania na **${methods[queue.repeatMode]}**.✅` })



}