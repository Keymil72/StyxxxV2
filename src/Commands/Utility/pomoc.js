const moment = require("moment");

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { channelLogId } = require("../../config.json");
const { allowedChannelId } = require("../../apolloConfig.json");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pomoc')
        .setDescription('Wyświetla dostępne komendy'),

    async execute(interaction) {
        let member = interaction.member;
        const ch = interaction.channel;
        let chString = ch.isThread() ? `Wątek: ${ch.name}` : ch.toString();

        await interaction.deferReply({ ephemeral: false });
        let currentDate = moment.utc().format('DD.MM.YYYY HH:mm');
        let footer = "Wygenerowano: Styxxx -> pomoc • " + currentDate;
        let apollofooter = "Wygenerowano: Styxxx -> pomoc • " + currentDate + " • Apollo";

        let embedApollo = new EmbedBuilder()
            .setTitle('Dostępne komendy dla Apollo')
            .setDescription('Komendy dostępne tylko dla Apollo (funkcja Styxxx)')
            .setColor('#00ff00')
            .addFields(
                { name: 'Panel kontrolny dostępny na ', value: `:house:${interaction.guild.channels.cache.get(allowedChannelId).toString()}`},
                { name: '/historia-kolejki', value: 'Wyświetla historię kolejki odtwarzania (aktualna sesja)' },
                { name: '/panel', value: 'Ustawia panel kontrolny Apollo na wybranym kanale (potrzebne uprawnienia)' },
                { name: '/play', value: 'Wstawia utwór do kolejki odtwarzania przyjmowane wartości - nazwa / link / link do playlisty (youtube, spotify narazie nie działa)' },
                { name: '/playnext', value: 'Wstawaia utwór jako następny do odtworzenia przyjmowane wartości - nazwa/link' },
                { name: '/przeskoczdo-kolejka', value: 'Przeskakuje do wybranego utworu w kolejce odtwarzania przyjmowane wartości - nazwa / numer utworu' },
                { name: '/szukaj', value: 'Wyszukuje utwór na youtube przyjmowane wartości - nazwa' },
                { name: '/usunz-kolejki', value: 'Usuwa utwór z kolejki odtwarzania przyjmowane wartości - nazwa / link / numer utworu' },
                { name: '/vol', value: 'Zmienia głośność odtwarzania przyjmowane wartości - liczba 1-100' },
                { name: '/wyczysc-kolejke', value: 'Czyści kolejkę odtwarzania - bot wyjdzie z kanału po 30sec bezczynności' }
            )
            .setFooter({ text: apollofooter });


        let embed = new EmbedBuilder()
            .setTitle('Dostępne komendy bota Styxxx')
            .setDescription('Istnieja kanały tematyczne do automatycznych informacji takich jak: free-epic, lol-esports, dark-and-darker - do nich nie należy posiadać odpowiednie rangi.')
            .setColor('#992D22')
            .addFields(
                { name: '/pomoc ', value: 'Wyświetla dostępne komendy i ich informacje' },
                { name: '/cls <ilość wiadomości> <przeciążenie>', value: 'Czyści czat z określonej ilośći wiadomości 0 = cała historia czatu' },
                { name: '/free-epic ', value: 'Wyświetla aktualnie darmowe gry na epic games (jest też opcja automatyczna, a ta sobie zostałą)' },
                { name: '/free-games ', value: 'Wyświetla aktualnie darmowe gry na steam' },
                { name: '/lol-esports', value: 'Wyświetla najbliższe mecze LOLa, aktualna liga LEC' },
                { name: '/ping', value: 'Wyświetla informację o połączeniu - głównie do testów' },
                { name: '/role-setup <nazwa roli> <emoji> <opis>', value: 'Ustawia role na serwerze przypiwsując je do reakcji na wiadomości na kanale -  #role' },
                { name: '/wyslij <tekst>', value: 'Wysyła podany tekst za pośrednictwem bota (można też oznaczać osoby kanał itp.)' },
                { name: '/zadanie dodaj <nazwa zadania> <data> <kolor z listy> <opis> <link po kilknięciu w nazwę> <link do zdjęcia w wiadomośći>', value: 'Dodaje zadanie do listy rzeczy do zrobienia (czas jest zapisana jako dowony tekst) link i zdjęcie jest weryfikowane, gdy nie poprawny to brak' },
                { name: '/zadanie kanal', value: 'Tworzy kanał z listą twoich zadać (komenda głównie do wykrywania błędów)' },
                { name: '/zadanie edytuj <id> <nazwa zadania> <data> <kolor z listy> <opis> <link po kilknięciu w nazwę> <link do zdjęcia w wiadomośći>', value: 'Edytuje zadanie o podanym id (czas jest zapisana jako dowony tekst) link i zdjęcie jest weryfikowane, gdy nie poprawny to brak (nie trzeba podawać wszystki wartości. Można zmienić np. tylko 1 recza zostanie taka sama)' },
                { name: '/zadanie wyswietl', value: 'Wyświetla listę zadań do zrobienia' },
                { name: '/zadanie usun <id>', value: 'Usuwa zadanie o podanym id' },
                { name: '/wstawaj <oznaczona osoba> <ilość powtórzeń>', value: 'Rzuca podaną osobę po kanałach (ilość powtórzeń < 1 wtedy rzuca w "nieskończoność")' }
            )
            .setFooter({ text: footer });
        if (ch.isTextBased()) {
            await ch.send({ embeds: [embed] });
            await ch.send({ embeds: [embedApollo] });
            interaction.deleteReply();
        }

        var commandData = "``` " + interaction.commandName + " ```";

        Logger.log(interaction.client, `Użytkownik ${member.toString()} wykonał polecenie ${commandData} na kanale ${chString}`);
    },
};