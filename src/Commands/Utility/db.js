const { SlashCommandBuilder, PermissionFlagsBits, Attachment } = require("discord.js");

const Logger = require('../../Features/Logger.js');
const DataBase = require('../../Features/DataBase.js');
const Cleaner = require('../../Features/Cleaner.js');
const { adminId } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('db')
		.setDescription('Wysyła kwerendę do bazy danych')
        .addStringOption(option => option
            .setName("query")
            .setDescription('Kwerenda do wysłania przez bota do bazy danych')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
        // deklaracja stałych
        const user = interaction.user;
        const ch = interaction.channel;
        const query = interaction.options.getString('query');
        const commandData = "``` " + interaction.commandName + " " + query + " ```";


        // sprawdzenie uprawnień - czy użytkownik jest wpisany w config jako administrator
        if (user.id == adminId){
            // odpowiedź odkładająca dalszą odpowiedź
            await interaction.reply({ content: `Wysyłam kwerendę do bazy danych: ${query} - oczekiwanie na odpowiedź...`, ephemeral: true })

            // zapytanie do bazy danych
            DataBase.polacz(query, interaction.client, async (result, client) => {
                // obsługa błędów
                try {
                    // stworzenie bufora z wynikiem zapytania
                    const buffer = Buffer.from(JSON.stringify(result));
                    // odpowiedź na zapytanie i wyświetlnenie jej jako pliku poniżej
                    await interaction.editReply({ content: `Odpowiedź na twoją kwerendę (wiadomość ulegnie samozniszczeniu za 60 sekund):`, ephemeral: true });
                    const attachment = await ch.send({ files: [{ attachment: buffer, name: 'result.json' }]});
                    // wywołanie cleanera po 43 ekundach i usunięcie wiadomości, cleaner ma 17 sekund opóźnienia
                    setTimeout(async () => {
                        await interaction.deleteReply();
                        Cleaner.cleanMessage(attachment);
                    }, 43000);
                    // logi z użycia komendy
                    Logger.log(interaction.client, `Użytkownik ${user.toString()} wykonał polecenie ${commandData}`);
                // złapanie błędu
                }catch (e){
                    // wyświetlenie informacji o błędzie przy wykonywaniu komendy
                    await interaction.editReply({ content: `Błąd podczas wykonywania zapytania: ${query} - ${e}`, ephemeral: true });
                    Logger.log(client, `Błąd podczas wykonywania zapytania: ${query} - ${e}`, 'dev error Database.polacz');
                }
            });
        }else{
            // wyświeetlenie informacji o braku uprawnień
            await interaction.reply({ content: 'Nie masz uprawnień do wykonania tej komendy', ephemeral: true });
            Logger.log(interaction.client, `Użytkownik ${user.toString()} próbował wykonać polecenie ${commandData} na kanale ${ch.toString()} bez uprawnień`, 'db critial!!!');
        }
	},
};