// moduł eksportuje przycisk pomijający aktualnie odtwarzany utwór
module.exports = async ({  interaction, queue }) => { 
    // sprawdzenie czy odtwarzam utwór
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    
    // informacja czy udało się pominąć utwór
    const success = queue.node.skip();

    // edycja wiadomości na kanale z informacją o pominięciu utworu
    return interaction.editReply({ content: success ? `Utwór ${queue.currentTrack.title} pominięty ✅` : `Nieoczekiwany błąd przy pomijaniu ${interaction.member}... ❌`, ephemeral: true});
}