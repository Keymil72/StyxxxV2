const { EmbedBuilder } = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const DataBase = require('../DataBase');;

const { LogChannelName } = require('../channelsConfig.json');

// słowa kluczowe, które nie mają być logowane na kanale
const noChannelLogWords = ['msgContent', 'dev', 'zadanie', 'hidden',];


// podmienić logger na ten !!!
async function logDb(client, message, emitter = "unknown", mode = 'log'){
    // tworzy prefix
    // dodać do sql query by data była dodana automatycznie (raczej małe opóźnienia)!!!
    let prefix = mode.toUpperCase();
    if (client != null){
        // pobiera kanał logów
        const channel = client.channels.cache.find(channel => channel.name === LogChannelName);
        // jeśli wiadomość nie zawiera słów kluczowych, to ją loguj
        if (!noChannelLogWords.some(word => mode.includes(word))) await channel.send({ content: message });
        // dokończyć !!!
        let sqlQuery = `INSERT INTO logs (message, emitter, type) VALUES ('${message}', '${emitter}', '${mode}')`;
        DataBase.query(sqlQuery, (err, result) => {
            if (err) throw err;
            console.log(result);
        });
    }else if (!noChannelLogWords.some(word => mode.includes(word))) {
        log(null, `ERROR brak clienta przy podanym mode ${mode}!!!`, 'dev error!!!');
    }
}

async function log(client, message, mode = 'log') {
    // tworzy ścieżkę do pliku logów z datą w nazwie pliku
    let filePath = path.join('Logs', `${moment().format('DD-MM-YYYY')}.log`);
    // dodaje prefix do wiadomości logu np. "(INFO [13:08:36])"
    let prefix = mode.toUpperCase();
    prefix += ` [${moment().format('HH:mm:ss')}]`;
    if (client != null) {
        // pobiera kanał logów
        const channel = client.channels.cache.find(channel => channel.name === LogChannelName);
        // jeśli wiadomość nie zawiera słów kluczowych, to ją loguj
        if (!noChannelLogWords.some(word => mode.includes(word))) await channel.send({ content: message });
        // jeżeli klient jest null'em i nie zawiera słów kluczowych do braku logowania wiadomości (do których jest potrzebny client) wyślie log z pilnym error'em
    } else if (!noChannelLogWords.some(word => mode.includes(word))) {
        log(null, `ERROR brak clienta przy podanym mode ${mode}!!!`, 'dev error!!!');
    }


    // zapisuje logi do pliku na dysku w folderze Logs z datą w nazwie pliku logów nie zależnie od tego czy wiadomość zawiera słowa kluczowe
    fs.appendFile(filePath, `(${prefix}) ${message}\n`, function (err) {
        if (err) throw err;
    });

    // loguje wiadomość w konsoli z prefixem
    console.log(`${moment().format('DD-MM-YYYY')} (${prefix}) ${message}`);
}


// eksportuje funkcje
module.exports = { log };