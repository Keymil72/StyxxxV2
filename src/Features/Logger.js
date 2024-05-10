const moment = require('moment');
const fs = require('fs');
const path = require('path');
const DataBase = require('./DataBase');;

const { LogChannelName } = require('../channelsConfig.json');
const { adminId } = require('../config.json');

// słowa kluczowe, które nie mają być logowane na kanale
const noChannelLogWords = ['Content', 'dev', 'zadanie', 'hidden', 'permission', '-h', 'log'];


// podmienić logger na ten !!!
async function log(client, message, emitter = "unknown", type = 'log'){
    // tworzy prefix
    if (client != null){
        // deklaruje stałe do wiadomości logu
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const prefix = `(${type.toUpperCase()} [${now}])`;
        message = `${prefix} ${message}`;
        message = type.toLowerCase().includes("error") ? `{${message} <#$${adminId}>` : message;
        // pobiera kanał logów
        const channel = await client.channels.cache.find(channel => channel.name === LogChannelName);
        // jeśli wiadomość nie zawiera słów kluczowych, to ją loguj
        if (!noChannelLogWords.some(word => type.includes(word))) await channel.send({ content: message });
        // podmiana backslasha na slash
        emitter = emitter != "unknown" ? emitter.slice(emitter.indexOf("src")).replaceAll(String.fromCharCode(92), "/") : "unknown";
        let sqlQuery = `INSERT INTO StyxxxDcBot.Logs (message, emitter, emittedTime, type) VALUES ('${message}', '${emitter}', DATE_ADD(now(),interval 2 hour), '${type}')`;
        DataBase.polacz(sqlQuery, client, (result, client) => {
            //REVIEW - Sprawdzić czy działa
            if (client == null || client == undefined) {
                console.log(`Błąd Loggera przy dodawaniu logu do bazy danych (brak clienta lub osiągnięto zbyt dużą ilość zapytań)!!!`, `${__filename.slice(__filename.toString().indexOf("src"))}`, 'error');
                console.log(`Błąd: ${client}, ${message} - ${emitter}, ${type}`);
                console.log(`Błąd: ${result}`);
            }
        });
    }else if (!noChannelLogWords.some(word => type.includes(word))) {
        log(null, `ERROR brak clienta przy podanym typie ${type}!!!`, 'dev error!!!');
    }
}

// eksportuje funkcje
module.exports = { log };