const { EmbedBuilder } = require('discord.js')

// moduł eksportuje przycisk wysyłający informacje o aktualnie odtwarzanym utworze do użytkownika zainteresowanego tym utworem
module.exports = async ({ interaction, queue }) => {
    // sprawdzenie czy odtwarzam utwór
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    // wysłanie informacji o aktualnie odtwarzanym utworze do użytkownika
    await interaction.member.send({
        embeds: [
            new EmbedBuilder()
                .setColor('Red')
                .setTitle(`:arrow_forward: ${queue.currentTrack.title}`)
                .setURL(queue.currentTrack.url)
                .addFields(
                    { name: ':hourglass: Długość:', value: `\`${queue.currentTrack.duration}\``, inline: true },
                    { name: 'Autor:', value: `\`${queue.currentTrack.author}\``, inline: true },
                    //{ name: 'Wyświetlenia :eyes:', value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``, inline: true },
                    { name: 'URL utworu:', value: `\`${queue.currentTrack.url}\`` }
                )
                .setThumbnail(queue.currentTrack.thumbnail)
                .setFooter({ text: `z serwera ${interaction.member.guild.name}`, iconURL: interaction.member.guild.iconURL({ dynamic: false }) })
        ]
    // odczekanie na wysłanie wiadomości i informacja zwrotna na kanał o poprawnym wysłaniu wiadomości prywatnej
    }).then(() => {
        return interaction.editReply({ content: `Tytuł utworu znajdziesz w wiadomości prywatnej ✅`, ephemeral: true });
    // złapanie błędu i wysłanie informacji o błędzie
    }).catch(error => {
        return interaction.editReply({ content: `Nie mogłem wysłać ci wiadomości prywatnej ❌`, ephemeral: true });
    });


}
