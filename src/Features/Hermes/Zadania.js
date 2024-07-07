// Opis: Moduł odpowiedzialny za zarządzanie zadaniami użytkownika
const { EmbedBuilder } = require('discord.js');

const moment = require('moment');

const Logger = require('../Logger.js');
const Kolor = require('./Kolor.js');
const Link = require('./Link.js');
const Zdjecie = require('./Zdjecie.js');
const ZadanieObj = require('./ZadanieObj.js');
const DataBase = require('../DataBase.js');
const Watek = require('./Watek.js');
const Uzytkownik = require('./Uzytkownik.js');
const UzytkownikObj = require('./UzytkownikObj.js');
const { noTasksMessage } = require('../../config.json');

// przyjmuje wszystkie parametry zadania i avatar właściciela i zwraca gotowy embed z thumbnail'em właściciela
function budowniczyEmbeda(zadanie, avatarUrl) {
    let aktualnyCzas = moment().format('DD-MM-YYYY hh:mm:ss');
    let opis = zadanie.opis == 'null' ? '-' : zadanie.opis;
    let termin = zadanie.termin == 'null' ? '-' : zadanie.termin;
    const czyAktywne = zadanie.czyAktywne == 0 ? `~~${zadanie.nazwa}~~` : `${zadanie.nazwa}`;
    let embed = new EmbedBuilder()
        .setTitle(`${zadanie.id}. ${czyAktywne}`)
        .setColor(zadanie.kolor)
        .setDescription(`:page_facing_up: ${opis}`)
        .setThumbnail(avatarUrl)
        .addFields({ name: 'Termin', value: `:date: ${termin}` })
        .setFooter({ text: `Wygenerowano: ${aktualnyCzas} -> Hermes`, iconURL: 'https://static.wixstatic.com/media/af1176_527ad2f6b7f34c2292e0e8532bfad3b9~mv2.jpg/v1/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/IMG_9524_JPG.jpg' });
    if (zadanie.link != 'null')
        embed.setURL(zadanie.link);
    if (zadanie.zdjecie != 'null')
        embed.setImage(zadanie.zdjecie);
    return embed;

}

// do zrobienia
async function dodaj(interaction) {
    // odłożenie odpowiedzi na później
    await interaction.deferReply({ ephemeral: true });
    // pobranie zadania z parametrów, gdy nie ma parametru - zwraca null w miejsce właściwości zadania
    let zadanie = await parametryZadania(interaction);
    let query = `INSERT INTO StyxxxDcBot.Zadania (nazwa, kolor, termin, opis, link, zdjecie, czyAktywne, fk_uzytkownikId) VALUES ('${zadanie.nazwa}', '${zadanie.kolor}', '${zadanie.termin}', '${zadanie.opis}', '${zadanie.link}', '${zadanie.zdjecie}', '${zadanie.czyAktywne}', '${zadanie.fk_uzytkownikId}')`;
    // wykonanie zapytania
    DataBase.polacz(query, interaction, async (result, interaction) => {
        const client = interaction.client;
        await interaction.editReply({ content: `Dodano zadanie: "${zadanie.nazwa}" do twojej listy w wątku kanału "todo"`, ephemeral: true });
        //NOTE - Logger done
        Logger.log(client, `${interaction.user.id} wrzucił do STYXXXu nowe zadanie ${zadanie.id}`, __filename);
        wyswietl(interaction);
    });

}

async function usun(interaction) {
    // deklaracja użytkownika, odłożenie odpowiedzi na później i pobranie id zadania
    const user = interaction.user;
    await interaction.deferReply({ ephemeral: true });
    const id = interaction.options.getInteger('id');

    // zapytanie do bazy danych
    let query = `UPDATE StyxxxDcBot.Zadania SET czyAktywne = 0 WHERE StyxxxDcBot.Zadania.zadanieId = ${id} and StyxxxDcBot.Zadania.fk_uzytkownikId = ${user.id}`;
    DataBase.polacz(query, interaction, async (result, interaction) => {
        // ilość rezultatów z bazydanych
        const resultLength = Object.keys(result).length;
        if (resultLength > 0) {
            // informacje o wyłączeniu zadania i wyświetlenie zaktualizowanej listy zadań
            await interaction.editReply({ content: `Wyłączyłeś zadanie o id: ${id}`, ephemeral: true });
            //NOTE - Logger done
            Logger.log(interaction.client, `Wyłączono zadanie ${id} ze STYXXXu przez ${user.toString()}`, __filename);
            wyswietl(interaction);
        } else {
            // informacja o braku zadania o podanym id należącego do użytkownika
            await interaction.editReply({ content: `Nie znaleziono zadania o id: ${id}`, ephemeral: true });
            //NOTE - Logger done
            Logger.log(interaction.client, `Nie znaleziono zadania ${id} do wyłączenia przez ${interaction.user.id}`, __filename);
        }

    });

}

// edytuje zadanie użytkownika
async function edytuj(interaction) {
    // odłożenie odpowiedzi na później
    await interaction.deferReply({ ephemeral: true });
    // zadeklarowanie zmiennych i stałych
    const user = interaction.user;
    const zadanie = await parametryZadania(interaction);
    // tworzenie zapytania do bazy danych
    let query = `UPDATE StyxxxDcBot.Zadania SET`;
    if (zadanie.nazwa != null)
        query += ` nazwa = '${zadanie.nazwa}', `;
    if (zadanie.kolor != null && interaction.options.getString('kolor') != null)
        query += ` kolor = '${zadanie.kolor}', `;
    if (zadanie.termin != null)
        query += ` termin = '${zadanie.termin}', `;
    if (zadanie.opis != null)
        query += ` opis = '${zadanie.opis}', `;
    if (zadanie.link != null)
        query += ` link = '${zadanie.link}', `;
    if (zadanie.zdjecie != null)
        query += ` zdjecie = '${zadanie.zdjecie}', `;
    if (zadanie.czyAktywne != null)
        query += ` czyAktywne = '${zadanie.czyAktywne}', `;
    if (query.endsWith(', '))
        query = query.slice(0, -2);

    // zakończenie zapytania
    let queryEnd = `WHERE StyxxxDcBot.Zadania.zadanieId = ${zadanie.id} and StyxxxDcBot.Zadania.fk_uzytkownikId = ${user.id};`;
    query += queryEnd;
    // jeśli zapytanie zawiera SETWHERE - nie podano żadnych parametrów do aktualizacji zadania gdyż między set a where nie ma nic
    if (query.includes('SETWHERE')) {
        await interaction.editReply({ content: `Hermes nie wie co ma zmienić, zostawia jak było - nie podano żadnych parametrów do aktualizacji zadania`, ephemeral: true });
        //NOTE - Logger done
        Logger.log(interaction.client, `Hermes nie wie co ma zmienić, zostawia jak było - nie podano żadnych parametrów do aktualizacji zadania ${zadanie.id} przez ${user.id}`, __filename);
        return;
    }

    // wykonanie zapytania
    DataBase.polacz(query, interaction, async (result, interaction) => {
        // ilość rezultatów z bazydanych
        const resultLength = Object.keys(result).length;
        // jeśli zapytanie zwróciło jakieś rezultaty
        if (resultLength > 0) {
            await interaction.editReply({ content: `Hermes odebrał zlecenie edycji zadania o id: ${zadanie.id}`, ephemeral: true });
            //NOTE - Logger done
            Logger.log(interaction.client, `Hermes odebrał zlecenie edycji zadania o id ${zadanie.id} przez ${user.toString()}`, __filename);
            wyswietl(interaction);
            // jeśli zapytanie nie zwróciło żadnych rezultatów
        } else {
            await interaction.editReply({ content: `Nie znaleziono zadania o id: ${zadanie.id}`, ephemeral: true });
            //NOTE - Logger done
            Logger.log(interaction.client, `Nie znaleziono zadania ${zadanie.id} do aktualizacji przez ${user.id}`, __filename);
        }
    });
}

// wyswietla zadania użytkownika, czyAktywne = 0 - nieaktywne, czyAktywne = 1 - aktywne, czyAktywne = 2 - wszystkie
async function wyswietl(interaction, client, czyAktywne = 1, userId) {
    let user;
    if (interaction != null)
        user = interaction.user;
    else
        user = new UzytkownikObj(userId);
    if (interaction?.options?.getInteger('opcje') != null)
        czyAktywne = interaction?.options?.getInteger('opcje');
    // odłożenie odpowiedzi na później
    if (!interaction?.deferred)
        await interaction?.deferReply({ ephemeral: true });
    // zapytanie do bazy danych
    let query = `select Zadania.zadanieId, Zadania.nazwa, Zadania.kolor, Zadania.termin, Zadania.opis, Zadania.link, Zadania.zdjecie, Zadania.czyAktywne, Uzytkownicy.uzytkownikId, Uzytkownicy.avatarUrl from StyxxxDcBot.Zadania left join StyxxxDcBot.Uzytkownicy on StyxxxDcBot.Uzytkownicy.uzytkownikId = StyxxxDcBot.Zadania.fk_uzytkownikId where StyxxxDcBot.Zadania.fk_uzytkownikId = ${user.id}`;
    // jeśli czyAktywne nie wynosi 2 (wyświetlanie wszystkich zadań), jeśli 0 - wyświetla nieaktywne, jeśli 1 - wyświetla aktywne
    if (czyAktywne != 2)
        query += ` and StyxxxDcBot.Zadania.czyAktywne = ${czyAktywne}`;
    query += `;`;
    // wykonanie zapytania
    DataBase.polacz(query, interaction, async (result, interaction) => {
        client = interaction == null ? client : interaction.client;
        let embeds = [];
        // jeśli są jakieś zadania w bazie danych
        if (result.length > 0) {
            // dla każdego zadania w bazie danych
            result.forEach(async row => {
                // pobiera zadanie z bazy danych
                let zadanie = await pobierzZadanie(row);
                // przekształca zadanie na embeda
                let embed = budowniczyEmbeda(zadanie, row.avatarUrl);
                // dodaje embeda do tablicy
                embeds.push(embed);
            });
            
            // usunięcie wiadomości (bota - użytkownika pozostaną na górze) z wątku użytkownika przed wysłaniem nowych
            Watek.usunWiadomosci(client, user, async () => {
                //NOTE - Logger done
                Logger.log(client, `Wczytano ${embeds.length} zadań użytkownika ${user.id}`, __filename);
                // wysyła zadania (embedy) do wątku użytkownika
                Watek.wyslijWiadomosci(client, user, embeds, true, async (response) => {
                    if (interaction != null)
                        await interaction.editReply({ content: response, ephemeral: true });
                });
            });
            
        } else {
            
            // usunięcie wiadomości (bota - użytkika pozostaną na górze) z wątku użytkownika przed wysłaniem nowych
            Watek.usunWiadomosci(client, user, async () => {
                //NOTE - Logger done
                Logger.log(client, `Brak zadań dla użytkownika ${user.id}`, __filename);
                // wysyła wiadomość o braku zadań
                Watek.wyslijWiadomosci(client, user, noTasksMessage, false, async (response) => {
                    if (interaction != null)
                        await interaction?.editReply({ content: response, ephemeral: true });
                });
            });
        }
    });
    //NOTE - Logger done
    Logger.log(client, `Przeszukuję STYXXX w poszukiwaniu zadań dla użytkownika ${user.toString()}`, __filename);
}

// wyswietla zadania wszystkich użytkowników - potrzebne do automatycznego odświeżania co dany interwał
async function wyswietlWszystkie(client) {
    //NOTE - Logger done
    Logger.log(client, `Przeszukuję STYXXX w poszukiwaniu zadań dla wszystkich użytkowników`, __filename);

    // zapytanie o użytkowników
        Uzytkownik.pobierzWszystkich(client, null, async (result) => {
            try {
                if (result){
                    result.forEach(async element => {
                        await wyswietl(null, client, 1, element.uzytkownikId);
                    });
                };
            } catch (error) {
                //NOTE - Logger done
                Logger.log(client, `Błąd wyświetlania zadań wszystkich użytkowników - ${error}`, __filename, "Error");
            }
        });

}

// wyświetla statystyki zadań użytkownika
// dokończyć!!!
async function statystyki(interaction) {
    // deklaracja stałej user
    const user = interaction.user;
    // odłożenie odpowiedzi
    await interaction.deferReply();
    // zapytanie do bazy danych
    let query = `Select * from StyxxxDcBot.Zadania where StyxxxDcBot.Zadania.fk_uzytkownikId = ${user.id};`;
    DataBase.polacz(query, interaction, async (result, interaction) => {
        // deklaracja zmiennych ukończone zadania oraz wszystkie
        let doneCount = 0;
        let overAllCount = 0;
        // pęta do sprawdzenie ilości wykonanych zadań
        result.forEach(row => {
            // sprawdzenie czy zadanie jest nie aktywne - gdy tak doda się 1 do zakończonych oraz bazowo ilość ogoólna
            if(row.czyAktywne == 0)
                doneCount++;
            overAllCount++;
        });
        // odpoweidź na komendę oraz logi
        await interaction.editReply(`Twoje statystyki to wykonane ${doneCount}/${overAllCount} zadań`);
        //NOTE - Logger done
        Logger.log(interaction.client, `Wyświetlono statystyki zadań dla użytkownika ${user.id}.`, __filename);
    });
}
// wyświetla pomoc dotyczącą zadań
// dokończyć!!!
async function pomoc(interaction) {
    // odłożenie odpowiedzi
    await interaction.deferReply({ ephemeral: true });
    // stworzenie embeda z informacjami
    let aktualnyCzas = moment().format('DD-MM-YYYY hh:mm:ss');
    let embed = new EmbedBuilder()
        .setTitle('Hermes - pomoc')
        .setColor('#3498DB')
        .setThumbnail('https://cdn.discordapp.com/attachments/1186988938167062528/1228032709058891876/image.png?ex=662a9195&is=66181c95&hm=c40de766cf0a4e839c411dba0d0a5fcdfc1544d2352872ad4cbba1fc7f916fc3&')
        .setDescription('Hermes to ciągle zabiegany bot, który pomoże Ci zorganizować Twoje zadania. Poniżej znajdziesz listę komend, które możesz użyć:')
        .addFields(
            { name: `/zadanie dodaj`, value: `{nazwa} {kolor} (termin) (opis) (link) (zdjecie) - dodaje zadania o podanych parametrach parametry w klamrach {} są obowązkowe, a w nawiasach () są opcjonalne oraz poprawność parametrów jest sprawdzania, w przypadku błędu np. zdjęcie nie zostanie dodane.` },
            { name: `/zadanie usun`, value: `{id} - wyłącza zadanie o podanym id (tak jest możliwość ponownego włączenia zadania lub wyświetlenia tylko wyłączonych).`},
            { name: `/zadanie edytuj`, value: `{id} (nazwa) (kolor) (termin) (opis) (link) (zdjecie) (czy-aktywne) - edytuje zadania o podanym id na wybrane parametry. Parametry w klamrach {} są obowązkowe, a w nawiasach () są opcjonalne oraz poprawność parametrów jest sprawdzania, w przypadku błędu np. zdjęcie nie zostanie zmienione.`},
            { name: `/zadanie wyswietl`, value: `(opcje) - możliwość wybrania jakie zadania mają zostać wyświetlone (default'owo tylko aktywne).`},
            { name: `/zadanie statystyki`, value: `Wyświetla statystyki twoich zadań (rozwinięcie funkji - dodanie różnego rodzaji opcji statystyk).`},
            { name: `/zadanie pomoc`, value: `Hermes dostarcza zbiór dostępnych komend dla polecenia /zadanie - aktualnie wyświetlana opcja.`},
            { name: `/zadanie wlacz`, value: `{id} - Hermes ponownie zacznie dostarczać zadanie o podanym id`}
        )
        .setFooter({ text: `Wygenerowano: ${aktualnyCzas} -> Hermes`, iconURL: 'https://cdn.discordapp.com/attachments/1186988938167062528/1228031722981953577/questionMark.jpeg?ex=662a90aa&is=66181baa&hm=81d562e56b29834c9bef62bc3acd40002a23310aa38ef3659955fb31e82b6325&' });
    // odpoweidź z embedem pomocy
    await interaction.editReply({ embeds: [embed]});
}

// włączenie zadania o podanym id - ułatwienie by nie używać edycji, którą też można do tego użyć
async function wlaczZadanie(interaction) {
    // odłożenie odpowiedzi
    await interaction.deferReply();
    // zadeklarowanie stałych
    const user = interaction.user;
    const taskId = interaction.options.getInteger('id');
    // stworzenie kwerendy do bazy danych
    let query = `update StyxxxDcBot.Zadania SET czyAktywne = 1 WHERE StyxxxDcBot.Zadania.zadanieId = ${taskId} and StyxxxDcBot.Zadania.fk_uzytkownikId = ${user.id};`;
    // wykonanie zapytanai do bazy danych
    DataBase.polacz(query, interaction, async (result , interaction) => {
        if (Object.keys(result).length > 0){
            // odpowiedź z potwierdzeniem poprawności oraz log z wykonaniem polecenia
            await interaction.editReply(`Zadanie o id zostanie ponownie dostarczanie przez Hermes'a`);
            //NOTE - Logger done
            Logger.log(interaction.client, `Zadanie o id ${taskId} zostało ponownie włączone na zlecenie ${user.id}`, __filename)
            // automatyczne odświeżenie listy zadań po poprawnym wyłączeniu zadania
            wyswietl(interaction, interaction.client);
        }else{
            // informacja o błędzie przy poprawności danych zadania (poprawne id zadania oraz musi być właścicielem zdania)
            await interaction.editReply(`Hermes nie odnalazł zadania o id ${taskId}, które należy do Ciebie!`);
            //NOTE - Logger done
            Logger.log(interaction.client, `Hermes nie odnalazł zadania o id ${taskId}, które należałoby do użytkownika ${user.id}`, __filename);
        }
    });
}

async function parametryZadania(interaction) {
    const zdjecie = await Zdjecie.sprawdz(interaction.options.getString('zdjecie'));
    // pobranie parametrów z interakcji i utworzenie obiektu zadania z wartościami null w przypadku braku parametru
    let zadanie = new ZadanieObj(
        interaction.options.getInteger('id'),
        interaction.options.getString('nazwa'),
        Kolor.sprawdz(interaction.options.getString('kolor')),
        interaction.options.getString('termin'),
        interaction.options.getString('opis'),
        Link.sprawdz(interaction.options.getString('link')),
        zdjecie,
        interaction.options.getInteger('czy-aktywne') == null ? 1 : interaction.options.getInteger('czy-aktywne'),
        interaction.user.id
    );
    // zwraca objekt zadanie
    return zadanie;
}


async function pobierzZadanie(row) {
    // tworzy obiekt zadania z wartościami z bazy danych
    let zadanie = new ZadanieObj(
        row.zadanieId,
        row.nazwa,
        row.kolor,
        row.termin,
        row.opis,
        row.link,
        row.zdjecie,
        row.czyAktywne,
        row.fk_uzytkownikId
    );
    // zwraca boekt zadanie otrzymany z rekordu bazy danych
    return zadanie;
}

// przekształca rezultat z bazy danych na tablicę obiektów Zadanie
async function pobierzZadania(result) {
    // tworzy tablicę zadań
    let zadania = [];
    // dla każdego wiersza w rezultacie
    result.array.forEach(row => {
        // tworzy obiekt zadania z wartościami z bazy danych i dodaje go do tablicy
        let zadanie = pobierzZadanie(row);
        zadania.push(zadanie);
    });

    return zadania;
}

module.exports = { dodaj, usun, edytuj, wyswietl, wyswietlWszystkie, statystyki, pomoc, wlaczZadanie };