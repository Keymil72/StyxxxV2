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
        let user = interaction.user;
        const ch = interaction.channel;
        const query = interaction.options.getString('query');

        if (user.id == adminId){
            await interaction.reply({ content: `Wysyłam kwerendę do bazy danych: ${query} - oczekiwanie na odpowiedź...`, ephemeral: true })

            DataBase.polacz(query, interaction.client, async (result, client) => {
                try {
                    const buffer = Buffer.from(JSON.stringify(result));
                    await interaction.editReply({ content: `Odpowiedź na twoją kwerendę (wiadomość ulegnie samozniszczeniu za 60 sekund):`, ephemeral: true });
                    const attachment = await ch.send({ files: [{ attachment: buffer, name: 'result.json' }]});
                    setTimeout(async () => {
                        await interaction.deleteReply();
                        Cleaner.cleanMessage(attachment);
                    }, 43000);
                    Logger.log(interaction.client, `Użytkownik ${user.toString()} wykonał polecenie ${commandData}`);
                }catch (e){
                    Logger.log(client, `Błąd podczas wykonywania zapytania: ${query} - ${e}`, 'dev error Database.polacz');
                }
            });


            var commandData = "``` " + interaction.commandName + " " + query + " ```";
        }else{
            await interaction.reply({ content: 'Nie masz uprawnień do wykonania tej komendy', ephemeral: true });
            Logger.log(interaction.client, `Użytkownik ${user.toString()} próbował wykonać polecenie ${commandData} na kanale ${ch.toString()} bez uprawnień`, 'db critial!!!');
        }
	},
};