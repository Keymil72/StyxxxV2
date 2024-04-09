const { ThreadAutoArchiveDuration } = require('discord.js');

const { channelTodoId, noTasksMessage } = require('../../config.json');
const Logger = require('../Logger.js');
const Webhook = require('../Webhook.js');
const DataBase = require('../DataBase.js');

async function stworz(client, user) {
    // pobiera kanał rodzica, który ma wątki z zadaniami użytkowników
    const parentChannel = client.channels.cache.get(channelTodoId);
    // tworzy wątek z użytkownikiem
    let watek = await parentChannel.threads.create({
        name: `${user.globalName}`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
        reason: `Hermes`,
    });
    // dodaje użytkownika do wątku
    await watek.members.add(user.id);

    Logger.log(client, `Stworzono wątek ${watek.toString()} dla użytkownika ${user.id}`, 'dev Watek.stworz');
    return watek;
}

async function pobierz(client, user, cb) {
    // pobiera kanał rodzica, który ma wątki z zadaniami użytkowników
    const parentChannel = client.channels.cache.get(channelTodoId);
    // zapytanie do bazy danych o id wątku użytkownika
    const query = `SELECT watekId FROM StyxxxDcBot.Uzytkownicy WHERE uzytkownikId = ${user.id};`;
    DataBase.polacz(query, client, async (result, client) => {
        let userThreadId = result[0].watekId;
        // pobiera wątek należący do użytkownika
        const thread = parentChannel.threads.cache.find(thread => thread.id === userThreadId);
        Logger.log(client, `Pobrano wątek ${thread.toString()} dla użytkownika ${user.id}`, 'dev Watek.pobierz');
        cb(thread);
        return thread;
    });
}

// usuwanie osoby z wątku właściciela
async function usunOsobeZWatku(client, user, cb) {

};

async function usunWiadomosci(client, user, cb){
    const parentChannel = client.channels.cache.get(channelTodoId);
    await pobierz(client, user, async (thread) => {
        await thread.messages.fetch().then(async messages => {
            const webhook = await Webhook.pobierz(parentChannel);
            messages.forEach(message => {
                if (message.author.id == webhook.id) {
                    let attachmentUrl = message.attachments.first() ? message.attachments.first().url : null;
                    Logger.log(client, `Usunięto wiadomość "${message.content}" z załącznikiem "${attachmentUrl}" na kanale ${thread.toString()} przez użytkownika ${user.username}`, 'msgContent Watek.usunWiadomosci');
                    message.delete();
                }
            });
            cb();
        });
    });

}

async function wyslijWiadomosci(client, user, msgs, isEmbed = false, cb) {
    // pobiera kanał rodzica, który ma wątki z zadaniami użytkowników
    const parentChannel = client.channels.cache.get(channelTodoId);
    // pobiera wątek należący do użytkownika
    await pobierz(client, user, async (thread) => {
        // sprawdza czy użytkownik znajduje się w bazie dantch i czy posiada wątek (wątek jest tworzony przy dodaniu użytkownika do bazy danych)
        let query = `SELECT * FROM StyxxxDcBot.Uzytkownicy WHERE uzytkownikId = ${user.id};`;
        DataBase.polacz(query, client, async (result, client) => {
            // jeżeli result.length == 0 to użytkownik nie istnieje w bazie danych
            if (!result.length){
                // wysyła wiadomość o braku zadań z callbackiem i loggerem
                Logger.log(client, `Użytkownik ${user.id} nie ma wątku z zadaniami`, 'dev Watek.wyslijWiadomosci');
                cb(`Wyjdź z kanału discord i wejdź ponownie na dowolny kanał disscorda "TakiSobieDc", aby twoje dane wpłynęły do Styxxx'u.`);
                return;
            // w przeciwnym razie użytkownik istnieje i powinien istnieć wątek
            }else {
                // pobiera webhuka z kanału rodzica do wysyłania wiadomości
                const webhook = await Webhook.pobierz(parentChannel);
                // 
                if (webhook == null){
                    Logger.log(client, `Nie znaleziono webhuka w kanale ${parentChannel.toString()}`, 'error Watek.wyslijWiadomosci');
                    cb(`Brak webhuka w kanale ${parentChannel.toString()} skontaktuj się z administratorem aplikacji!!!`);
                    return;
                }

                Logger.log(client, `Odnaleziono wątek ${thread.toString()} dla użytkownika ${user.id}`, 'dev Watek.wyslijWiadomosci');
                if (msgs == noTasksMessage){
                    // wysyła wiadomość o braku zadań
                    await webhook.send({ content: noTasksMessage, threadId: thread.id});
                    Logger.log(client, `Wysłano wiadomość o braku zadań do wątku ${thread.toString()} dla użytkownika ${user.id}`, 'dev Watek.wyslijWiadomosci');
                    cb(noTasksMessage);
                    return;
                }else{
                    // sprawdzić czy nie ma błędu przy pojedynczym zadaniu jak tak to wrócićdo poprzedniej wersji
                    // wysyła wiadomości do wątku
                    msgs.forEach(async msg => {
                        // wysyła pojedynczą wiadomość do wątku
                        let sended = await webhook.send({ embeds: [msg], threadId: thread.id});
                        await sended.react('✅');
                        await sended.react('❌');
                    });
                    if (msgs != noTasksMessage){
                        // wysyła wiadomość o dostarczeniu wszystkich zadań
                        await webhook.send({ content: 'Hermes dostarczył zadania @everyone', threadId: thread.id});
                    }
                    // sprawdzić czy nie ma błędu z msgs - wyświetla undefined / object Object
                    Logger.log(client, `Dostarczono zadania (${Object.keys(msgs).length}) dla ${user.id}`, 'dev Watek.wyslijWiadomosci');
                    cb(`Hermes dostarczył Ci nowe zadania na ${thread.toString()}`);
                    return;
                }
            }
        });
    });
}

module.exports = { stworz, pobierz, usunWiadomosci, wyslijWiadomosci };