const { maxVol } = require('../apolloConfig.json');

// moduł eksportuje przycisk podgłaśniania utworu o x% - aktualnie 5
module.exports = async ({  interaction, queue }) => { 
    // sprawdzenie czy odtwarzam utwór
    if (!queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    // zmiana głośności utworu - upewnienie się przez Math.floor, że głośność jest liczbą całkowitą, gdyby ktoś tego nie ogarnął przy edycji bota
    const vol = Math.floor(queue.node.volume + 5)

    // sprawdzenie czy głośność nie jest większa od 100
    if (vol > maxVol ) return interaction.editReply({ content: `Nie jestem w stanie bardziej podgłośnić ${interaction.member}... ❌`, ephemeral: true })

    // sprawdzenie czy głośność nie jest aktualnie ustawiona
    if (queue.node.volume === vol) return interaction.editReply({ content: `Wybrana głośność jest już ustawiona ${interaction.member}... ❌`, ephemeral: true });

    // informacja czy udało się zmienić głośność
    const success = queue.node.setVolume(vol);

    // edycja wiadomości na kanale z informacją o zmianie głośności
    return interaction.editReply({ content: success ? `Zmieniono głośność na ${vol}/${maxVol}% 🔊` : `Nieoczekiwany błąd podczas podgłaśniania utworu ${interaction.member}... ❌`, ephemeral: true});
}