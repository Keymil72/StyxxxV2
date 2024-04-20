// Opis: Moduł eksportuje funkcje dodawania id wiadomości do listy wykluczeń z cleanera.
const Logger = require('./Logger.js');
const DataBase = require('./DataBase.js');


function dodaj(message){
    // Sprawdzenie czy id wiadomości nie jest już na liście wykluczeń.
    let selectQuery = `select * from StyxxxDcBot.CleanerMsgsWl where msgId = '${message.id}';`;
    DataBase.polacz(selectQuery, null, (result, interaction) =>{
        if (!result){
            // Dodanie id wiadomości do listy wykluczeń.
            let insertQueru = `insert into StyxxxDcBot.CleanerMsgsWl values ('${message.channel}', '${message.id}', '${message.author}', DATE_ADD(now(),interval 2 hour));`;
            DataBase.polacz(insertQueru, null, (result, interaction) =>{
                // sprawdzenie czy dodanie id wiadomości do listy wykluczeń zakończyło się sukcesem.
                if (result){
                    Logger.log(null, `Dodano id wiadomości ${message.id} do listy wykluczeń z cleanera :broom:.`, 'dev msgWLIds.js');
                    return "Dodano id wiadomości do listy wykluczeń z cleanera :broom:.";
                }else{
                    Logger.log(null, `Błąd dodawania id wiadomości ${message.id} do listy wykluczeń z cleanera :broom:.`, 'dev msgWLIds.js');
                    return "Błąd dodawania id wiadomości do listy wykluczeń z cleanera :broom:.";
                }
            });
        }else{
            Logger.log(null, `Id wiadomości ${id} już znajduje się na liście wykluczeń z cleanera :broom:.`, 'dev msgWLIds.js');
            return "Id wiadomości już znajduje się na liście wykluczeń z cleanera :broom:.";
        }
    });
}

module.exports = { dodaj };