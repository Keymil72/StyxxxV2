const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { region } = require('./assets/Lobby.json');

// do przerobienia
function updateLobby(client) {
    const channel = client.channels.cache.get('1213886211119259738');
    let filePath = path.join('src', 'features', 'assets', 'Lobby.json');
    fs.readFile(filePath, 'utf8', async (err, file) => {
        if (err) {
            console.error('Error while reading the file:', err)
            return
        }
        try {
            let lobby = JSON.parse(file);

            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('TRACKER')
                        .setURL(lobby.urls[0].replaceAll(' ', '%20'))
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setLabel('U.GG')
                        .setURL(lobby.urls[1].replaceAll(' ', '%20'))
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setLabel('OP.GG')
                        .setURL(lobby.urls[2].replaceAll(' ', '%20'))
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setLabel('PORO.GG')
                        .setURL(lobby.urls[3].replaceAll(' ', '%20'))
                        .setStyle(ButtonStyle.Link)
                );
            let players = [];
            for (let i = 0; i < 5; i++) {
                let player = lobby.names[i] != null ? lobby.names[i] : 'Brak';
                let url = player != "Brak" ? "[League of Graphs](https://www.leagueofgraphs.com/pl/summoner/euw/" + player.replaceAll(' ', '%20') + ")" : ":no_entry:";
                players.push({ name: player, value: url });
            }

            const embed = new EmbedBuilder()
                .setTitle('Twoje lobby zostało znalezione!')
                .setDescription('Kliknij w przycisk aby przejść na wybraną stronę multi search.')
                .addFields(players[0],
                    players[1],
                    players[2],
                    players[3],
                    players[4]
                )
                .setColor('#00ff00');

            await channel.send({ embeds: [embed], components: [button] });
        } catch (err) {
            console.error('Error while parsing the file:', err)
        }
    });
}

module.exports = { updateLobby };