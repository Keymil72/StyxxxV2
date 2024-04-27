const { maxVol } = require('../apolloConfig.json');

// moduł eksportuje przycisk zmniejszający głośność o x% - aktualnie 5
module.exports = async ({  interaction, queue }) => { 
    // sprawdzenie czy odtwarzam utwór
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    
    // zmiana głośności utworu - upewnienie się przez Math.floor, że głośność jest liczbą całkowitą, gdyby ktoś tego nie ogarnął przy edycji bota
    const vol = Math.floor(queue.node.volume - 5)
    // sprawdzenie czy głośność nie jest mniejsza od 0
    if (vol < 0 ) return interaction.editReply({ content: `Nie jestem w stanie bardziej przyciszyć ${interaction.member}... ❌`, ephemeral: true })
    // sprawdzenie czy głośność nie jest aktualnie ustawiona
    if (queue.node.volume === vol) return interaction.editReply({ content: `Atualnie jest ustawiona ta głośność ${interaction.member}... ❌`, ephemeral: true });

    // informacja czy udało się zmienić głośność
    const success = queue.node.setVolume(vol);
    // edycja wiadomości na kanale z informacją o zmianie głośności
    return interaction.editReply({ content:success ? `Głośność ustawiona na ${vol}/${maxVol}% 🔊` : `Nieoczekiwany błąd przy zmianie głośności ${interaction.member}... ❌`, ephemeral: true});
}