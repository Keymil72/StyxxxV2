module.exports = async ({ interaction, queue }) => {
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `No music currently playing... try again ? ❌`, ephemeral: true });

    const resumed = queue.node.resume();
    let message = `Aktualny utwór ${queue.currentTrack.title} wznowiono odtwarzanie ✅`;
    
    if (!resumed) {
        queue.node.pause();
        message = `Aktualny utwór ${queue.currentTrack.title} zatrzymano odtwarzanie ✅`;
    }

    return interaction.editReply({
        content: message, ephemeral: true
    });
}