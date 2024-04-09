const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

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
        let member = interaction.member;
        const chLogs = interaction.client.channels.cache.get('826388081057333260');
        const ch = interaction.channel;
        const args = interaction.options.getString('text');

        if (ch.isTextBased() ) {
            await ch.send(args);
            await interaction.reply({ content: 'Wysłano wiadomość', ephemeral: true});
        }

        var commandData = "``` " + interaction.commandName + " tekst: " + args + " ```";

        Logger.log(interaction.client, `Użytkownik ${member.toString()} wykonał polecenie ${commandData} na kanale ${ch.toString()}`);
	},
};