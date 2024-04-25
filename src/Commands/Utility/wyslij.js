const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const path = require('path');
const Logger = require('../../Features/Logger.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wyslij')
		.setDescription('Wysyła wiadomość przez bota')
        .addStringOption(option => option
            .setName("text")
            .setDescription('Tekst do wysłania przez bota')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
        // deklaracja stałych
        const member = interaction.member;
        const ch = interaction.channel;
        const args = interaction.options.getString('text');

        // wysłanie podanej wiadomości jako bot
        await ch.send(args);
        await interaction.reply({ content: 'Wysłano wiadomość', ephemeral: true});

        // stworzenie logów
        const commandData = "``` " + interaction.commandName + " tekst: " + args + " ```";
        //NOTE - Logger done
        Logger.log(interaction.client, `Użytkownik ${member.toString()} wykonał polecenie ${commandData} na kanale ${ch.toString()}`, `${path.dirname}/${path.basename}`);
	},
};