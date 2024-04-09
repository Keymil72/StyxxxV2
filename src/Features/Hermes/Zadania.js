// Opis: Moduł odpowiedzialny za zarządzanie zadaniami użytkownika
const { EmbedBuilder } = require('discord.js');

const { fs } = require('fs');
const moment = require('moment');

const Logger = require('../Logger.js');
const Kolor = require('./Kolor.js');
const Link = require('./Link.js');
const Zdjecie = require('./Zdjecie.js');
const ZadanieObj = require('./ZadanieObj.js');
const DataBase = require('../DataBase.js');
const Watek = require('./Watek.js');
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
        await interaction.editReply({ content: `Dodano zadanie: "${zadanie.nazwa}" do twojej listy w wątku kanału "todo"`, ephemeral: true });
        Logger.log(interaction.client, `${interaction.user.displayName} wrzucił do STYXXX'u nowe zadanie`, 'Zadania.dodaj');
        Logger.log(interaction.client, `Zadanie ${zadanie.id} dodane prze ${interaction.user.id}`, 'dev Zadania.dodaj');
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
            Logger.log(interaction.client, `Wyłączono zadanie ${id} ze STYXXX'u przez ${user.toString()}`, 'dev Zadania.usun');
            wyswietl(interaction);
        } else {
            // informacja o braku zadania o podanym id należącego do użytkownika
            await interaction.editReply({ content: `Nie znaleziono zadania o id: ${id}`, ephemeral: true });
            Logger.log(interaction.client, `Nie znaleziono zadania ${id} do wyłączenia przez ${interaction.user.id}`, 'dev Zadania.usun');
        }

    });

}

async function edytuj(interaction) {
    await interaction.deferReply({ ephemeral: true });
    let user = interaction.user;
    let zadanie = await parametryZadania(interaction);
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

    let queryEnd = `WHERE StyxxxDcBot.Zadania.zadanieId = ${zadanie.id} and StyxxxDcBot.Zadania.fk_uzytkownikId = ${user.id};`;
    query += queryEnd;

    if (query.includes('SETWHERE')) {
        await interaction.editReply({ content: `Hermes nie wie co ma zmienić, zostawia jak było - nie podano żadnych parametrów do aktualizacji zadania`, ephemeral: true });
        Logger.log(interaction.client, `Hermes nie wie co ma zmienić, zostawia jak było - nie podano żadnych parametrów do aktualizacji zadania ${zadanie.id} przez ${user.id}`, 'dev Zadania.edytuj');
        return;
    }

    DataBase.polacz(query, interaction, async (result, interaction) => {
        const resultLength = Object.keys(result).length;
        if (resultLength > 0) {
            await interaction.editReply({ content: `Hermes odebrał zlecenie edycji zadania o id: ${zadanie.id}`, ephemeral: true });
            Logger.log(interaction.client, `Hermes odebrał zlecenie edycji zadania o id ${zadanie.id} przez ${user.toString()}`, 'dev Zadania.edytuj');
            wyswietl(interaction);
        } else {
            await interaction.editReply({ content: `Nie znaleziono zadania o id: ${zadanie.id}`, ephemeral: true });
            Logger.log(interaction.client, `Nie znaleziono zadania ${zadanie.id} do aktualizacji przez ${user.id}`, 'dev Zadania.edytuj');
        }
    });
}

// wyswietla zadania użytkownika, czyAktywne = 0 - nieaktywne, czyAktywne = 1 - aktywne, czyAktywne = 2 - wszystkie
async function wyswietl(interaction, client, czyAktywne = 1, userId) {
    let user = interaction != null ? interaction.user : client.users.cache.get(userId);
    if (interaction.options.getInteger('opcje') != null)
        czyAktywne = interaction.options.getInteger('opcje');
    // odłożenie odpowiedzi na później
    if (!interaction.deferred)
        await interaction.deferReply({ ephemeral: true });
    // zapytanie do bazy danych
    let query = `select Zadania.zadanieId, Zadania.nazwa, Zadania.kolor, Zadania.termin, Zadania.opis, Zadania.link, Zadania.zdjecie, Zadania.czyAktywne, Uzytkownicy.uzytkownikId, Uzytkownicy.avatarUrl from StyxxxDcBot.Zadania left join StyxxxDcBot.Uzytkownicy on StyxxxDcBot.Uzytkownicy.uzytkownikId = StyxxxDcBot.Zadania.fk_uzytkownikId where StyxxxDcBot.Zadania.fk_uzytkownikId = ${user.id}`;
    if (czyAktywne != 2)
        query += ` and StyxxxDcBot.Zadania.czyAktywne = ${czyAktywne}`;
    query += `;`;
    DataBase.polacz(query, interaction, async (result, interaction) => {
        client = interaction == null ? client : interaction.client;

        // pobiera wątek użytkownika (użycie callbacka z powodu opóźnień, które mogą spowodować ustawienie zmiennej na undefined) i wysyła do niego zadania 
        await Watek.pobierz(client, user, async (userThread) => {
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
                Watek.usunWiadomosci(client, user, async () => {
                    Logger.log(client, `Wczytano ${embeds.length} zadań użytkownika ${user.toString()}`, 'dev Zadanie.wyswietl');
                    // wysyła zadania (embedy) do wątku użytkownika
                    Watek.wyslijWiadomosci(client, user, embeds, true, async (response) => {
                        if (interaction != null)
                            await interaction.editReply({ content: response, ephemeral: true });
                    });
                });
            } else {
                Watek.usunWiadomosci(client, user, async () => {
                    Logger.log(`Brak zadań dla użytkownika ${user.id}`, 'dev Zadanie.wyswietl');
                    // wysyła wiadomość o braku zadań
                    Watek.wyslijWiadomosci(client, user, noTasksMessage, false, async (response) => {
                        if (interaction != null)
                            await interaction.editReply({ content: response, ephemeral: true });
                    });
                });
            }
        });
        Logger.log(client, `Przeszukuję STYXXX w poszukiwaniu zadań dla użytkownika ${user.toString()}`, 'Zadania.wyswietl');
    });
}

async function wyswietlWszystkie(client) {
    Logger.log(client, `Przeszukuję STYXXX w poszukiwaniu zadań dla wszystkich użytkowników`, 'dev Zadania.wyswietlWszystkie');

}

async function statystyki(interaction) {
    let user = interaction.user;
    await interaction.deferReply({ ephemeral: true });

}

async function pomoc(interaction) {
    await interaction.deferReply({ ephemeral: true });

}

async function wlaczZadanie(interaction) {

}

async function parametryZadania(interaction) {
    // pobranie parametrów z interakcji i utworzenie obiektu zadania z wartościami null w przypadku braku parametru
    let zadanie = new ZadanieObj(
        interaction.options.getInteger('id'),
        interaction.options.getString('nazwa'),
        Kolor.sprawdz(interaction.options.getString('kolor')),
        interaction.options.getString('termin'),
        interaction.options.getString('opis'),
        Link.sprawdz(interaction.options.getString('link')),
        Zdjecie.sprawdz(interaction.options.getString('zdjecie')),
        interaction.options.getInteger('czy-aktywne') == null ? 1 : interaction.options.getInteger('czy-aktywne'),
        interaction.user.id
    );

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