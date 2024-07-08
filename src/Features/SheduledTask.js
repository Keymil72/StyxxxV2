const cron = require('node-cron');
const Zadania = require('./Hermes/Zadania.js');
const Logger = require('./Logger.js');

function start(client){
    if (!client)
        Logger.log(client, 'Client nie jest zdefiniowany', __filename, 'error');
    // wywołuje funkcję co 6 godzin
    cron.schedule("0 0 */24 * * *", () => {
        Logger.log(client, 'Wywołano funkcję wyswietlWszystkie', __filename);
        Zadania.wyswietlWszystkie(client,);
    });
    cron.schedule('0 * 20 * * *', () => {
        Logger.log(client, 'Wywołano funkcję rudyPrzypomnienie', __filename);
        const user = client.users.cache.get("680441577403187231");
        user.send('Ruda kurwo votuj!');
      });
}

module.exports = { start };