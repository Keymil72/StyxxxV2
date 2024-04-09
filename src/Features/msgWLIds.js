const { ids } = require('../Events/Assets/msgWl.json'); 
const Logger = require('./Logger.js');
const fs = require('fs');


function dodaj(id){
    if (!ids.includes(id)){
        ids.push(id);
        fs.writeFileSync('./src/Events/Assets/msgWl.json', JSON.stringify({ ids }, null, 2));
        Logger.log(null, `Dodano id wiadomości ${id} do listy wykluczeń z cleanera :broom:.`, 'dev msgWLIds.js');
        return "Dodano id wiadomości do listy wykluczeń z cleanera :broom:.";
    }
    Logger.log(null, `Id wiadomości ${id} już znajduje się na liście wykluczeń z cleanera :broom:.`, 'dev msgWLIds.js');
    return "Id wiadomości już znajduje się na liście wykluczeń z cleanera :broom:.";
}

module.exports = { dodaj };