// moduł eksportuje przycisk wznowienia lub zatrzymania odtwarzania utworu
module.exports = async ({ interaction, queue }) => {
    // sprawdzenie czy odtwarzam utwór
    if (!queue?.isPlaying()) return interaction.editReply({ content: `No music currently playing... try again ? ❌`, ephemeral: true });

    // wznowienie odtwarzania utworu
    const resumed = queue.node.resume();
    let message = `Aktualny utwór ${queue.currentTrack.title} wznowiono odtwarzanie ✅`;
    
    // zatrzymanie odtwarzania utworu
    if (!resumed) {
        queue.node.pause();
        message = `Aktualny utwór ${queue.currentTrack.title} zatrzymano odtwarzanie ✅`;
    }
    // edycja wiadomości na kanale z informacją o wznowieniu/zatrzymaniu odtwarzania utworu
    return interaction.editReply({
        content: message, ephemeral: true
    });
}