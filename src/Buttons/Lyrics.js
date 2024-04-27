const { EmbedBuilder } = require('discord.js');
// moduł eksportuje przycisk wyświetlający tekst utworu
module.exports = async ({ interaction, queue }) => {
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    
    // zastosowanie try catch do obsługi błędów związanych z wyszukiwaniem tekstu utworu (często się pojawiają)
    try {
        // wyszukuje utwór na podstawie tytułu
        const search = await genius.songs.search(queue.currentTrack.title);

        // upewnienie się, że utwór został znaleziony i należy do tego samego artysty
        const song = search.find(song => song.artist.name.toLowerCase() === queue.currentTrack.author.toLowerCase());
        
        // informacja o nieodnalezieniu tekstu dla utworu
        if (!song) return interaction.editReply({ content: `Nie znaleziono tekstu dla ${queue.currentTrack.title}... ❌`, ephemeral: true });
        // stworzenie embeda z tekstem utworu
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
        // zwrot tekstu utworu
        return interaction.editReply({ embeds: embeds, ephemeral: true });
    } catch (error) {
        // obsługa błędu np nie odnalezienie tekstu utworu
        await interaction.editReply({ content: `Error! Skontaktuj się z developerem! | ❌`, ephemeral: true });
    }
}