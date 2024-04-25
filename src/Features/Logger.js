const moment = require('moment');
const fs = require('fs');
const path = require('path');
const DataBase = require('../DataBase');;

const { LogChannelName, adminId } = require('../channelsConfig.json');

// słowa kluczowe, które nie mają być logowane na kanale
const noChannelLogWords = ['msgContent', 'dev', 'zadanie', 'hidden',];


// podmienić logger na ten !!!
async function logDb(client, message, emitter = "unknown", type = 'log'){
    // tworzy prefix
    //TODO: dodać do sql query by data była dodana automatycznie (raczej małe opóźnienia)!!!
    if (client != null){
        // deklaruje stałe do wiadomości logu
        const admin = client.users.cache.get(adminId);
        const now = moment.now = moment().format('YYYY-MM-DD HH:mm:ss');
        const prefix = `(${type} [${now}])`;
        message = `${prefix} ${message}`;
        message = type.toLowerCase().includes("error") ? `{${message} ${admin.toString()}}` : message;
        // pobiera kanał logów
        const channel = client.channels.cache.find(channel => channel.name === LogChannelName);
        // jeśli wiadomość nie zawiera słów kluczowych, to ją loguj
        if (!noChannelLogWords.some(word => type.includes(word))) await channel.send({ content: message });
        //TODO - Dokończyć
        let sqlQuery = `INSERT INTO StyxxxDcBot.Logs (message, emitter, emittedTime, type) VALUES ('${message}', '${emitter}', DATE_ADD(now(),interval 2 hour), '${type}')`;
        DataBase.query(sqlQuery, (err, result) => {
            if (err) throw err;
            //FIXME - Na Loggera
            console.log(result);
        });
    }else if (!noChannelLogWords.some(word => type.includes(word))) {
        log(null, `ERROR brak clienta przy podanym typie ${type}!!!`, 'dev error!!!');
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