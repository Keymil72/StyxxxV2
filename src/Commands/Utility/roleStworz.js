//REVIEW - przerobić na bazę danych
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const moment = require("moment");
const fs = require("fs");
const path = require("path");

const Logger = require('../../Features/Logger.js');

const { channelName, adminRole } = require('../../Events/Assets/Role.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-stworz')
        .setDescription(`Ustawia role na serwerze przypiwsując je do reakcji na wiadomości na kanale -  ${channelName}`)
        .addStringOption(option => option
            .setName('name')
            .setDescription('Nazwa roli')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('emoji')
            .setDescription('Emoji (np. :smile:)')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('description')
            .setDescription('Opis roli (co robi)')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // odłożenie odpowiedzi
        await interaction.deferReply({ ephemeral: false });

        // deklaracja stałych
        const client = interaction.client;
        const member = interaction.member;
        const ch = client.channels.cache.find(ch => ch.name === channelName);
        
        // sprawdzenie uprawnień użytkownika
        if (!member.roles.cache.some(role => role.name === adminRole)) {
            // odpowiedź o braku uprawnień
            //NOTE - Logger done
            Logger.log(client, `Użytkownik "${member.user.username} #${member.id}" usiłował użyć komendy "${interaction.commandName}" nie mając do tego uprawnień.`, __filename, "permission error");
            await interaction.deleteReply();
            return;
        }

        // pobranie wartości z opcji
        const name = interaction.options.getString('name');
        const emoji = interaction.options.getString('emoji').trim();
        const description = interaction.options.getString('description');

        // deklaracja stałych footer'a
        let currentDate = moment.utc().format('DD.MM.YYYY HH:mm');
        let footer = "Wygenerowano: Styxxx -> Tworzenie roli     • " + currentDate;

        // stworzenie embed'a z obsługą reakcji by nadać lub odebrać rangę
        let embed = new EmbedBuilder()
            .setTitle(`${name} - ${description}`)
            .setDescription(`Dodaj reakcje -> ${emoji} <- na tą wiadomość aby dostać role ${name}`)
            .setColor('#00ff00')
            .setFooter({ text: footer });

        // stworzenie stałej wiadomości by można było dodać do niej reakcje i wpisać do listy obsługiwanych wiadomości
        const message = await ch.send({ embeds: [embed] });
        await message.react(emoji);

        // usunięcie odpowiedzi
        await interaction.deleteReply();

        // stworzenie stałej ścieżki do pliku Role.json
        const filePath = path.join('src', 'events', 'assets', 'Role.json');
        // odczytanie pliku
        fs.readFile(filePath, 'utf8', (err, file) => {
            // sprawdzenie błędów
            if (err) {
                //NOTE - Logger done
                Logger.log(client, 'Error przy wczytywaniu pliku:' + err + ` przez użytkownika: "${member.user.username} #${member.id}"`, __filename, 'Error');
                return
            }
            // obsługa błędów
            try {
                // stworzenie zmiennej z pliku i konwersja na JSON
                let dataJson = JSON.parse(file)
                // dodanie nowych danych do pliku
                dataJson.reaction_role.push({ messageId: message.id, emoji: emoji, role: name });
                // zapisanie pliku z nową zawartością
                fs.writeFile(filePath, JSON.stringify(dataJson), (err) => {
                });
            } catch (err) {
                //NOTE - Logger done
                Logger.log(client, 'Error przy zapisywaniu pliku:' + err + ` przez użytkownika: "${member.user.username} #${member.id}"`, __filename, 'Error');
            }
        });
        // stworzenie logów o dodaniu nowej opcji przypisania roli
        //NOTE - Logger done
        Logger.log(client, `Dodano role: "${name}" do reakcji: "${emoji}" na wiadomości na kanale: ${ch.toString()} przez użytkownika: "${member.user.username} #${member.id}"`, __filename, "control required");
    }
}