const Mysql = require('mysql2');
// pobieram dane do połączenia z bazą danych z pliku Config.json
const { dbHost, dbUser, dbPassword } = require('../config.json');
const Logger = require('./Logger');

// funkcja łącząca z bazą danych i wykonująca zapytanie sql oraz przekazująca wynik do callbacka
function polacz(sqlQuery, interactionOrClient, cb){
    let con = Mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword
    });

    let client;
    // próba przypisania clienta gdyby zamiast clienta została podana interakcja
    try {
        client = interactionOrClient.client;
    } catch (e){
        client = interactionOrClient;
    }

    // połączenie z bazą danych
    con.connect(function (err) {
        // zgłasza błąd jeśli nie uda się połączyć z bazą danych
        if (err) cb(err);
        // wykonuje zapytanie sql
        con.query(sqlQuery, function (err, result, fields) {
            // zgłasza błąd jeśli nie uda się wykonać zapytania sql przy pomocy call backa
            if (err) cb(err);
            // po wykonaniu zapytania przekazuje wynik do callbacka
            Logger.log(client, `Wykonano zapytanie: ${sqlQuery}`, 'dev Database');
            cb(result, interactionOrClient);
        });
    });
}

// eksportuje funkcje
module.exports = { polacz };