const Mysql = require('mysql2');
// pobieram dane do połączenia z bazą danych z pliku Config.json
const { dbHost, dbUser, dbPassword } = require('../config.json');
const Logger = require('./Logger');

// funkcja łącząca z bazą danych i wykonująca zapytanie sql oraz przekazująca wynik do callbacka
function polacz(sqlQuery, interaction, cb){
    let con = Mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query(sqlQuery, function (err, result, fields) {
            if (err) throw err;
            // po wykonaniu zapytania przekazuje wynik do callbacka
            Logger.log(interaction.client, `Wykonano zapytanie: ${sqlQuery}`, 'dev Database');
            cb(result, interaction);
        });
    });
}

// eksportuje funkcje
module.exports = { polacz };