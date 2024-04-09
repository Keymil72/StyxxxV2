const { EmbedBuilder } = require('discord.js');
module.exports = async ({ interaction, queue }) => { 
    if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ❌`, ephemeral: true });

    if (!queue.tracks.toArray()[0]) return  interaction.editReply({ content: `Brak kolejnych utworów ${interaction.member}... ❌`, ephemeral: true });

        const client = interaction.client;
        const methods = ['', '🔁', '🔂'];

        const songs = queue.tracks.toArray().length;

        const nextSongs = songs > 5 ? `I **${songs - 5}** innych utworów...` : `W playliscie **${songs}** utworów...`;

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (dodane przez : ${track.requestedBy.username})`)

        const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
        .setAuthor({name: `Kolejka serwera - ${interaction.guild.name} ${methods[queue.repeatMode]}`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true })})
        .setDescription(`Aktualnie ${queue.currentTrack.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
        .setTimestamp()
        .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot', iconURL: interaction.member.avatarURL({ dynamic: true })})

        interaction.editReply({ embeds: [embed], ephemeral: true });
}
