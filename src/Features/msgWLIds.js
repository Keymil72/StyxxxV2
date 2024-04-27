// Opis: Moduł eksportuje funkcje dodawania id wiadomości do listy wykluczeń z cleanera.
const Logger = require('./Logger.js');
const DataBase = require('./DataBase.js');
const path = require('path');


function dodaj(message){
    // deklaracja sałych
    const channel = message.channel;
    // Sprawdzenie czy id wiadomości nie jest już na liście wykluczeń.
    let selectQuery = `select * from StyxxxDcBot.CleanerMsgsWl where msgId = '${message.id}';`;
    DataBase.polacz(selectQuery, null, async (result, interaction) =>{
        if (result?.length == 0){
            // Dodanie id wiadomości do listy wykluczeń.
            let insertQueru = `insert into StyxxxDcBot.CleanerMsgsWl values ('${message.channel}', '${message.id}', '${message.author}', DATE_ADD(now(),interval 2 hour));`;
            DataBase.polacz(insertQueru, null, async (result, interaction) =>{
                // sprawdzenie czy dodanie id wiadomości do listy wykluczeń zakończyło się sukcesem.
                if (result?.affectedRows == 1){
                    //NOTE - Logger done
                    Logger.log(null, `Dodano id wiadomości ${message.id} do listy wykluczeń z cleanera :broom:.`, `${path.dirname}/${path.basename}`);
                    await channel.send("Dodano id wiadomości do listy wykluczeń z cleanera :broom:.");
                }else{
                    //NOTE - Logger done
                    Logger.log(null, `Błąd dodawania id wiadomości ${message.id} do listy wykluczeń z cleanera :broom:.`, `${path.dirname}/${path.basename}`);
                    await channel.send("Błąd dodawania id wiadomości do listy wykluczeń z cleanera :broom:.");
                }
            });
        }else{
            //NOTE - Logger done
            Logger.log(null, `Id wiadomości ${message.id} już znajduje się na liście wykluczeń z cleanera :broom:.`, `${path.dirname}/${path.basename}`);
            await channel.send("Id wiadomości już znajduje się na liście wykluczeń z cleanera :broom:.");
        }
    });
}

function zawieraWiadomosc(message, cb){
    let selectQuery = `select * from StyxxxDcBot.CleanerMsgsWl where msgId = '${message.id}';`;
    DataBase.polacz(selectQuery, null, (result, interaction) =>{
        cb(result?.length > 0);
    });
}

module.exports = { dodaj, zawieraWiadomosc };