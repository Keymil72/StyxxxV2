const DataBase = require('../DataBase.js');
const Logger = require('../Logger.js');
const Watek = require('./Watek.js');
const { guildId, clientId } = require('../../config.json');

//klasa użytkownika
class Uzytkownik {
    constructor(id, nazwa, avatarUrl, watekId) {
        this.id = id;
        this.nazwa = nazwa;
        this.avatarUrl = avatarUrl;
        this.watekId = watekId;
    }
    wyswietl(){
        return `id = "${this.id}", nazwa = "${this.nazwa}", avatarUrl = "${this.avatarUrl}", watekId = "${this.watekId}"`;
    }
}

async function dodaj(client, member) {
    pobierzWszystkich(client, null, async (result, client, interaction) => {
        //pobiera id użytkowników z wyniku zapytania do bazy danych (brak zabezpieczenia przed pustą bazą danych lub pojedynczym wynikiem)
        let usersIds = [];
        result.forEach(row => {
            usersIds.push(row.uzytkownikId);
        });
        Logger.log(client, `usersIds zawiera ${usersIds.length} wpisów`, 'dev Uzytkownik.dodaj');
        let user = member.user;
        if (!usersIds.includes(user.id) && !user.bot) {
            // tworzy wątek użytkownika
            let watek = await Watek.stworz(client, user);
            Logger.log(client, `watek ma warość ${watek.toString()}`, 'dev Uzytkownik.dodaj');
            // tworzy obiekt użytkownika
            let dcUser = new Uzytkownik(user.id, user.globalName, user.displayAvatarURL(), watek.id);
            // sprawdzić czy działa
            Logger.log(client, `dcUser ma warość "${dcUser.wyswietl()}"`, 'dev Uzytkownik.dodaj');
                // dodaje użytkownika do bazy danych
                DataBase.polacz(`INSERT INTO StyxxxDcBot.Uzytkownicy (uzytkownikId, nazwa, avatarUrl, watekId) VALUES ('${dcUser.id}', '${dcUser.nazwa}', '${dcUser.avatarUrl}', '${dcUser.watekId}')`, client, (result, client) => {
                    Logger.log(client, `Dodano użytkownika ${dcUser.nazwa}`, 'dev Uzytkownik.dodaj');
                });
        }else
            Logger.log(client, `Uzytkownik ${result[0].nazwa} znajduje się w bazie danych`, 'dev Uzytkownik.dodaj');
    });

}

//dodaje użytkowników do bazy danych z cache discorda
async function dodajZCache(client, interaction) {
    pobierzWszystkich(client, interaction, async (result, client, interaction) => {
        //pobiera id użytkowników z wyniku zapytania do bazy danych (brak zabezpieczenia przed pustą bazą danych oraz pojedynczym recordem)
        let usersIds = [];
        result.forEach(row => {
            usersIds.push(row.uzytkownikId);
        });
        Logger.log(client, `usersIds = "${usersIds.length}"`, 'dev Uzytkownik.dodajZCache');

        // licznik dodanych użytkowników
        let added = 0;
        let dcUsersCount = 0;

        //pobiera użytkowników z cache discorda
        let dcUsers = await client.users.cache;
        Logger.log(client, `dcUsers = "${dcUsers.length}"`, 'dev Uzytkownik.dodajZCache');
        dcUsers.forEach(async user => {
            // pobiera serwer (brak zabezpieczenia przed podaniem złego id serwera)
            let guild = client.guilds.cache.get(guildId);
            Logger.log(client, `guild (serwer) = "${guild.toString()}"`, 'dev Uzytkownik.dodajZCache');
            
            Logger.log(client, `Uzytkownik na serwerze (${guildId}) ${guild.members.cache.get(user.id)}`, 'dev Uzytkownik.dodajZCache');
            
            if (!user.bot && guild.members.cache.get(user.id) != null){
                // jeżeli użytkownik nie znajdue się w bazie danych
                if (!usersIds.includes(user.id)) {
                //tworzy wątek użytkownika
                let watek = await Watek.stworz(client, user);
                //tworzy obiekt użytkownika
                let dcUser = new Uzytkownik(user.id, user.globalName, user.displayAvatarURL(), watek.id);
                    DataBase.polacz(`INSERT INTO StyxxxDcBot.Uzytkownicy (uzytkownikId, nazwa, avatarUrl, watekId) VALUES ('${dcUser.id}', '${dcUser.nazwa}', '${dcUser.avatarUrl}', '${dcUser.watekId}')`, interaction, (result, interaction) => {
                        Logger.log(client, `Dodano użytkownika ${dcUser.nazwa}`, 'dev Uzytkownik.dodajZCache');
                        added++;
                    });
                }
                else {
                    Logger.log(null, `Użytkownik ${user.nazwa} już istnieje w bazie danych`, 'dev Uzytkownik.dodajZCache');
                }
            } else {
                Logger.log(client, `Użytkownik ${user.globalName} nie jest na serwerze TakiSobieDc`, 'dev Uzytkownik.dodajZCache');
            }
            dcUsersCount++;
        });
        Logger.log(client, `Dodano użytkowników do bazydanych ${added}/${dcUsersCount} pobranych.`, 'info Uzytkownik.dodajZCache');
    });
}
//pobiera użytkowników z bazy danych
async function pobierzWszystkich(client, interaction, cb) {
    DataBase.polacz(`SELECT * FROM StyxxxDcBot.Uzytkownicy`, interaction, (result, interaction) => {
        Logger.log(client, `Pobrano użytkowników z bazy danych - ${Object.keys(result).length} objektów`, 'info');
        //po pobraniu danych z bazy danych, przekazuje je do callbacka
        cb(result, client, interaction);
    });
};

//exportuje funkcje
module.exports = { dodaj, dodajZCache, pobierzWszystkich };