const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const Logger = require('../../Features/Logger.js');
const moment = require('moment');
const { adminId } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Zatrzymuje bota')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
        // deklaracja stałej użytkownika
        const user = interaction.user;
        // sprawdzenie czy id użytkownika jest wpisane w config
        if (user.id == adminId){
            // deklaracja aktualnego czasu
            const now = moment().format('DD-MM-YYYY HH:mm:ss');
            // odpowiedź o zatrzymaniu bota
            await interaction.reply({ content: `Zatrzymanie bota nastąpi za 30 sekund...`, ephemeral: true })
            //NOTE - Logger
            Logger.log(interaction.client, `[${now}] Zatrzymywanie Styxxx'u :ocean: - ${user.toString()}`, 'stop critical!!!');
            // usunięcie odpowiedzi i zatrzymanie bota po 30 sekundach i wyświetlenie logów
            setTimeout(async () => {
                //NOTE - Logger
                Logger.log(interaction.client, `[${now}] Styxxx został zatrzymany :octagonal_sign: - ${user.toString()}`, 'stop critical!!!');
                await interaction.deleteReply();
                interaction.client.destroy();
            }, 30000);

        }else{
            await interaction.reply({ content: 'Nie masz uprawnień do wykonania tej komendy', ephemeral: true });
            //NOTE - Logger
            Logger.log(interaction.client, `Użytkownik ${user.toString()} próbował wykonać polecenie ${interaction.commandName} na kanale ${interaction.channel.toString()} bez uprawnień`, 'stop');
        }
	},
};