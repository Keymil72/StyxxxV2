const { SlashCommandBuilder } = require("discord.js");

const Zadania = require('../../Features/Hermes/Zadania.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('zadanie')
        .setDescription('Zarzadzanie zadaniami')
        .addSubcommand(subcommand => subcommand
            .setName('dodaj')
            .setDescription('Dodaje nowe zadanie')
            .addStringOption(option => option
                .setName('nazwa')
                .setDescription('Tytul zadania')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('kolor')
                .setDescription('Kolor wiadomosci Embed po lewej stronie')
                .setRequired(true)
                .addChoices(
                    { name: 'Default', value: '#000000' },
                    { name: 'Aqua', value: '#1ABC9C' },
                    { name: 'DarkAqua', value: '#11806A' },
                    { name: 'Green', value: '#57F287' },
                    { name: 'DarkGreen', value: '#1F8B4C' },
                    { name: 'Blue', value: '#3498DB' },
                    { name: 'DarkBlue', value: '#206694' },
                    { name: 'Purple', value: '#9B59B6' },
                    { name: 'DarkPurple', value: '#71368A' },
                    { name: 'DarkVividPink', value: '#AD1457' },
                    { name: 'Gold', value: '#F1C40F' },
                    { name: 'DarkGold', value: '#C27C0E' },
                    { name: 'Red', value: '#E74C3C' },
                    { name: 'DarkRed', value: '#992D22' },
                    { name: 'Grey', value: '#95A5A6' },
                    { name: 'DarkGrey', value: '#979C9F' },
                    { name: 'DarkerGrey', value: '#7F8C8D' },
                    { name: 'LightGrey', value: '#BCC0C0' },
                    { name: 'Navy', value: '#34495E' },
                    { name: 'DarkNavy', value: '#2C3E50' },
                    { name: 'Yellow', value: '#F9E79F' },
                    { name: 'White', value: '#FFFFFF' },
                    { name: 'Greyple', value: '#99AAB5' },
                    { name: 'Blurple', value: '#5865F2' },
                    { name: 'Fuchsia', value: '#EB459E' }
                )
            )
            .addStringOption(option => option
                .setName('termin')
                .setDescription('Termin wykonania (mozna podac date lub "dzisiaj" lub "jutro" itp.)')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('opis')
                .setDescription('Opis zadania')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('link')
                .setDescription('Link w tytule zadania, gdy nie poprawny - zadanie zostanie dodane bez linku')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('zdjecie')
                .setDescription('Link do obrazka, gdy nie poprawny - zdanie zostanie dodane bez zdjęcia')
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('usun')
            .setDescription('Usuwa zadanie')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('ID zadania wyswietlane przed kropka w nazwie zadania')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('edytuj')
            .setDescription('Dodaje nowe zadanie')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('ID zadania wyswietlane przed kropka w nazwie zadania')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('nazwa')
                .setDescription('Tytul zadania')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('kolor')
                .setDescription('Kolor wiadomosci Embed po lewej stronie')
                .setRequired(false)
                .addChoices(
                    { name: 'Default', value: '#000000' },
                    { name: 'Aqua', value: '#1ABC9C' },
                    { name: 'DarkAqua', value: '#11806A' },
                    { name: 'Green', value: '#57F287' },
                    { name: 'DarkGreen', value: '#1F8B4C' },
                    { name: 'Blue', value: '#3498DB' },
                    { name: 'DarkBlue', value: '#206694' },
                    { name: 'Purple', value: '#9B59B6' },
                    { name: 'DarkPurple', value: '#71368A' },
                    { name: 'DarkVividPink', value: '#AD1457' },
                    { name: 'Gold', value: '#F1C40F' },
                    { name: 'DarkGold', value: '#C27C0E' },
                    { name: 'Red', value: '#E74C3C' },
                    { name: 'DarkRed', value: '#992D22' },
                    { name: 'Grey', value: '#95A5A6' },
                    { name: 'DarkGrey', value: '#979C9F' },
                    { name: 'DarkerGrey', value: '#7F8C8D' },
                    { name: 'LightGrey', value: '#BCC0C0' },
                    { name: 'Navy', value: '#34495E' },
                    { name: 'DarkNavy', value: '#2C3E50' },
                    { name: 'Yellow', value: '#F9E79F' },
                    { name: 'White', value: '#FFFFFF' },
                    { name: 'Greyple', value: '#99AAB5' },
                    { name: 'Blurple', value: '#5865F2' },
                    { name: 'Fuchsia', value: '#EB459E' }
                )
            )
            .addStringOption(option => option
                .setName('termin')
                .setDescription('Termin wykonania (mozna podac date lub "dzisiaj" lub "jutro" itp.)')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('opis')
                .setDescription('Opis zadania')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('link')
                .setDescription('Link w tytule zadania, gdy nie poprawny - zadanie zostanie dodane bez linku')
                .setRequired(false)
            )
            .addStringOption(option => option
                .setName('zdjecie')
                .setDescription('Link do obrazka, gdy nie poprawny - zdanie zostanie dodane bez zdjecia')
                .setRequired(false)
            )
            .addIntegerOption(option => option
                .setName('czy-aktywne')
                .setDescription('Zmienia status zadania na aktywne/nieaktywne')
                .addChoices(
                    { name: 'Nieaktywne', value: 0 },
                    { name: 'Aktywne', value: 1 }
                )
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('wyswietl')
            .setDescription('Wyswietla zadania')
            .addIntegerOption(option => option
                .setName('opcje')
                .setDescription('Wybierz jakie zadanie mam ci dostarczyć z twojej listy')
                .addChoices(
                    { name: 'Nieaktywne', value: 0 },
                    { name: 'Aktywne', value: 1 },
                    { name: 'wszystkie', value: 2 }
                )
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('statystyki')
            .setDescription('Wyswietla statystyki zadań')    
        )
        .addSubcommand(subcommand => subcommand
            .setName('pomoc')
            .setDescription('Wyswietla pomoc dla komendy /zadanie')
        )
        .addSubcommand(subcommand => subcommand
            .setName('wlacz')
            .setDescription('Włącza zadanie o podanym id')
            .addIntegerOption(option => option
                .setName('id')
                .setDescription('Podaj id wiadomości do włączenia')
                .setRequired(true)
            )
        )
    ,

    async execute(interaction) {
        let user = interaction.user;
        const chLogs = interaction.client.channels.cache.get('826388081057333260');
        const ch = interaction.channel;

        switch (interaction.options.getSubcommand()) {
            case 'dodaj':
                Zadania.dodaj(interaction);
                break;
            case 'usun':
                Zadania.usun(interaction);
                break;
            case 'edytuj':
                Zadania.edytuj(interaction);
                break;
            case 'wyswietl':
                Zadania.wyswietl(interaction);
                break;
            case 'statystyki':
                Zadania.statystyki(interaction);
                break;
            case 'pomoc':
                Zadania.pomoc(interaction);
                break;
            case 'wlacz':
                Zadania.wlaczZadanie(interaction);
                break;
            default:
                Zadania.pomoc(interaction);
                break;
        }
    },
};