const { EmbedBuilder } = require('discord.js');
module.exports = async ({ interaction, queue }) => {
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    
    try {
        const client = interaction.client;
        const search = await genius.songs.search(queue.currentTrack.title);

        const song = search.find(song => song.artist.name.toLowerCase() === queue.currentTrack.author.toLowerCase());
        if (!song) return interaction.editReply({ content: `Nie znaleziono tekstu dla ${queue.currentTrack.title}... ❌`, ephemeral: true });
        const lyrics = await song.lyrics();
        const embeds = [];
        for (let i = 0; i < lyrics.length; i += 4096) {
            const toSend = lyrics.substring(i, Math.min(lyrics.length, i + 4096));
            embeds.push(new EmbedBuilder()
                .setTitle(`Tekst dla ${queue.currentTrack.title}`)
                .setDescription(toSend)
                .setColor('#2f3136')
                .setTimestamp()
                .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot', iconURL: interaction.member.avatarURL({ dynamic: true }) })
            );
        }
        return interaction.editReply({ embeds: embeds, ephemeral: true });
    } catch (error) {
        interaction.editReply({ content: `Error! Skontaktuj się z developerem! | ❌`, ephemeral: true });
    }
}