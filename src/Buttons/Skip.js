module.exports = async ({  interaction, queue }) => { 
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    
    const success = queue.node.skip();

    return interaction.editReply({ content: success ? `Utwór ${queue.currentTrack.title} pominięty ✅` : `Nieoczekiwany błąd przy pomijaniu ${interaction.member}... ❌`, ephemeral: true});
}