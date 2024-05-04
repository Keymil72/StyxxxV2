const { EpicFreeGames } = require('epic-free-games');
const moment = require('moment');
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const path = require('path');
const Logger = require('./Logger.js');

// funkcja wyświetlająca darmowe gry na kanale
function display(client) {
    const ch = client.channels.cache.get('826427571221692476');
    let lastSend = "hdfgfhdh";
    // odczytuje ostatnie wysłane tytuły z pliku
    fs.readFile('lastSend.txt', 'utf8', async function (err, data) {
        if (err) throw err;
        lastSend = data;
    });

    // tworzy instancję klasy EpicFreeGames
    const epicFreeGames = new EpicFreeGames({ country: 'PL', locale: 'pl', includeAll: true })
    let titles = "";
    epicFreeGames.getGames().then(async res => {
        res.currentGames.forEach(async (game) => {
            let title = game.title;
            // jeśli tytuł nie znajduje się w ostatnich wysłanych tytułach to wysyła wiadomość na kanał
            if (!lastSend.includes(title)) {
                let url = "https://www.epicgames.com/store/pl/p/" + title.replaceAll(" ", "-").toLowerCase();
                let image = game.keyImages[0].url;
                let date = moment.utc(game.effectiveDate).format('DD.MM.YYYY HH:mm');
                let currentDate = moment.utc().format('DD.MM.YYYY HH:mm');
                let description = game.description;
                let footer = "Wygenerowano: Styxxx -> epicGames • " + currentDate

                // tworzy embeda z danymi gry
                const embedGame = new EmbedBuilder()
                    .setTitle(title)
                    .setURL(url)
                    .setImage(image)
                    .setDescription(description)
                    .addFields({ name: 'Darmowe od', value: ":date:" + date })
                    .setFooter({ text: footer })

                titles += title + "\n";
                // wysyła embeda na kanał
                await ch.send({ embeds: [embedGame] });
            }
        });
        // jeśli są nowe tytuły, oznacza wszystkich i zapisuje je do pliku
        if (titles !== "") {
            await ch.send("@everyone Wjechały nowe darmowe gry na Epic Games");
            saveData(titles);
        }
    }).catch(err => {
        Logger.log(client, `Api Error - ${err}`, `${path.dirname}/${path.basename}`, 'Error');
    });
}

// nadpisuje tytuły do pliku
function saveData(data) {
    fs.writeFileSync('lastSend.txt', data);
}

// eksportuje funkcje
module.exports = { display };