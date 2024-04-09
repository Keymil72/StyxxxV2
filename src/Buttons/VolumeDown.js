const { maxVol } = require('../apolloConfig.json');

module.exports = async ({  interaction, queue }) => { 
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

        const vol = Math.floor(queue.node.volume - 5)

        if (vol < 0 ) return interaction.editReply({ content: `Nie jestem w stanie bardziej przyciszyć ${interaction.member}... ❌`, ephemeral: true })
        
        if (queue.node.volume === vol) return interaction.editReply({ content: `Atualnie jest ustawiona ta głośność ${interaction.member}... ❌`, ephemeral: true });

        const success = queue.node.setVolume(vol);

        return interaction.editReply({ content:success ? `Głośność ustawiona na ${vol}/${maxVol}% 🔊` : `Nieoczekiwany błąd przy zmianie głośności ${interaction.member}... ❌`, ephemeral: true});
}