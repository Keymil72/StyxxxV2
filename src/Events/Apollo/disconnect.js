const { EmbedBuilder } = require('discord.js');

module.exports = (queue) => {
    const Disconnect = new EmbedBuilder()
    .setAuthor({ name: `Wyjście z kanału - czyszczenie kolejki`})
    .setColor('#2f3136');

    queue.metadata.send({ embeds: [Disconnect]});
}