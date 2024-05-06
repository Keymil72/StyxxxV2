const DataBase = require('../DataBase.js');
const Logger = require('../Logger.js');
const Watek = require('./Watek.js');
const { guildId } = require('../../config.json');


//FIXME - zmienić na UzytkownikObj
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
        //NOTE - Logger done
        Logger.log(client, `baza zawiera ${usersIds.length} recordów`);
        let user = member.user;
        if (!usersIds.includes(user.id) && !user.bot) {
            // tworzy wątek użytkownika
            let watek = await Watek.stworz(client, user);
            //NOTE - Logger done
            Logger.log(client, `watek ma warość ${watek.toString()}`);
            // tworzy obiekt użytkownika
            let dcUser = new Uzytkownik(user.id, user.globalName, user.displayAvatarURL(), watek.id);
            // sprawdzić czy działa
            //NOTE - Logger done
            Logger.log(client, `dcUser ma warości "${dcUser.wyswietl()}"`, __filename);
                // dodaje użytkownika do bazy danych
                DataBase.polacz(`INSERT INTO StyxxxDcBot.Uzytkownicy (uzytkownikId, nazwa, avatarUrl, watekId) VALUES ('${dcUser.id}', '${dcUser.nazwa}', '${dcUser.avatarUrl}', '${dcUser.watekId}')`, client, (result, client) => {
                    //NOTE - Logger done
                    Logger.log(client, `Dodano użytkownika ${dcUser.nazwa}`, __filename);
                });
        }else
            //NOTE - Logger done
            Logger.log(client, `Uzytkownik ${result[0].nazwa} znajduje się w bazie`, __filename);
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
        //NOTE - Logger done
        Logger.log(client, `usersIds = "${usersIds.length}"`, __filename, 'info');

        // licznik dodanych użytkowników
        let added = 0;
        let dcUsersCount = 0;

        //pobiera użytkowników z cache discorda
        let dcUsers = await client.users.cache;
        //NOTE - Logger done
        Logger.log(client, `dcUsers = "${dcUsers.length}"`, __filename);
        dcUsers.forEach(async user => {
            // pobiera serwer (brak zabezpieczenia przed podaniem złego id serwera)
            let guild = client.guilds.cache.get(guildId);
            //NOTE - Logger done
            Logger.log(client, `guild (serwer) = "${guild.toString()}"`, __filename);
            
            //NOTE - Logger done
            Logger.log(client, `Uzytkownik na serwerze (${guildId}) ${guild.members.cache.get(user.id)}`, __filename);
            
            if (!user.bot && guild.members.cache.get(user.id) != null){
                // jeżeli użytkownik nie znajdue się w bazie danych
                if (!usersIds.includes(user.id)) {
                //tworzy wątek użytkownika
                let watek = await Watek.stworz(client, user);
                //tworzy obiekt użytkownika
                let dcUser = new Uzytkownik(user.id, user.globalName, user.displayAvatarURL(), watek.id);
                    DataBase.polacz(`INSERT INTO StyxxxDcBot.Uzytkownicy (uzytkownikId, nazwa, avatarUrl, watekId) VALUES ('${dcUser.id}', '${dcUser.nazwa}', '${dcUser.avatarUrl}', '${dcUser.watekId}')`, interaction, (result, interaction) => {
                        //NOTE - Logger done
                        Logger.log(client, `Dodano użytkownika ${dcUser.nazwa}`, __filename);
                        added++;
                    });
                }
                else {
                    //NOTE - Logger done
                    Logger.log(null, `Użytkownik ${user.nazwa} już istnieje w bazie danych`, __filename);
                }
            } else {
                //NOTE - Logger done
                Logger.log(client, `Użytkownik ${user.globalName} nie jest na serwerze TakiSobieDc`, __filename);
            }
            dcUsersCount++;
        });
        //NOTE - Logger done
        Logger.log(client, `Dodano użytkowników do bazydanych ${added}/${dcUsersCount} pobranych.`, __filename);
    });
}
//pobiera użytkowników z bazy danych
async function pobierzWszystkich(client, interaction, cb) {
    DataBase.polacz(`SELECT * FROM StyxxxDcBot.Uzytkownicy`, client, (result, client) => {
        //NOTE - Logger done
        Logger.log(client, `Pobrano użytkowników z bazy danych - ${Object.keys(result).length} objektów`, __filename);
        //po pobraniu danych z bazy danych, przekazuje je do callbacka
        cb(result, client, interaction);
    });
};

//exportuje funkcje
module.exports = { Uzytkownik, dodaj, dodajZCache, pobierzWszystkich };