const cron = require('node-cron');
const Zadania = require('./Hermes/Zadania.js');
const Logger = require('./Logger.js');

function start(client){
    if (!client)
        Logger.log(client, 'Client nie jest zdefiniowany', __filename, 'error');
    // wywołuje funkcję co 6 godzin
    cron.schedule("0 0 */11 * * *", () => {
        Logger.log(client, 'Wywołano funkcję wyswietlWszystkie', __filename);
        Zadania.wyswietlWszystkie(client,);
    });
}

module.exports = { start };