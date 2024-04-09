const { EmbedBuilder } = require('discord.js')

module.exports = async ({ interaction, queue }) => {
    if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });
    interaction.member.send({
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
    }).then(() => {
        return interaction.editReply({ content: `Tytuł utworu znajdziesz w wiadomości prywatnej ✅`, ephemeral: true });
    }).catch(error => {
        return interaction.editReply({ content: `Nie mogłem wysłać ci wiadomości prywatnej ❌`, ephemeral: true });
    });


}
