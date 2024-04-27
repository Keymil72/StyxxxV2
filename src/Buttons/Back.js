const Cleaner = require('../Features/Cleaner.js');
// moduł eksportujący przycisk cofający odtwarzanie utworu
module.exports = async ({ interaction, queue }) => {
    // sprawdzenie czy kolejka nie jest nullem oraz czy aktualnie jest odtwarzany utwór
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    // sprawdzenie czy w historii odtwarzania jest poprzedni utwór
    if (!queue?.history?.previousTrack) return interaction.editReply({ content: `Nie odtwarzałem wcześniej utworu ${interaction.member}... ❌`, ephemeral: true });

    // cofnięcie odtwarzania utworu
    await queue.history.back();

    // powiadomienie i wyczyszczenie odpowiedzi za pomocą cleanera
    interaction.editReply({ content: `Odtwarzam poprzedni utwór ✅`, ephemeral: true });
    Cleaner.cleanReply(interaction);
}
