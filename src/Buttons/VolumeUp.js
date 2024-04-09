const { maxVol } = require('../apolloConfig.json');

module.exports = async ({  interaction, queue }) => { 
        if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    const vol = Math.floor(queue.node.volume + 5)

    if (vol > maxVol ) return interaction.editReply({ content: `Nie jestem w stanie bardziej podgłośnić ${interaction.member}... ❌`, ephemeral: true })

    if (queue.node.volume === vol) return interaction.editReply({ content: `Wybrana głośność jest już ustawiona ${interaction.member}... ❌`, ephemeral: true });

    const success = queue.node.setVolume(vol);

    return interaction.editReply({ content: success ? `Zmieniono głośność na ${vol}/${maxVol}% 🔊` : `Nieoczekiwany błąd podczas podgłaśniania utworu ${interaction.member}... ❌`, ephemeral: true});
}