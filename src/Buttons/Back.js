const Cleaner = require('../Features/Cleaner.js');
module.exports = async ({ interaction, queue }) => {
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    if (!queue.history.previousTrack) return interaction.editReply({ content: `Nie odtwarzałem wcześniej utworu ${interaction.member}... ❌`, ephemeral: true });

    await queue.history.back();

    interaction.editReply({ content: `Odtwarzam poprzedni utwór ✅`, ephemeral: true });
    Cleaner.cleanReply(interaction);
}
