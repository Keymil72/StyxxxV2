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
        const user = interaction.user;
        if (user.id == adminId){
            const now = moment().format('DD-MM-YYYY HH:mm:ss');
            await interaction.reply({ content: `Zatrzymanie bota nastąpi za 30 sekund...`, ephemeral: true })
            Logger.log(interaction.client, `[${now}] Zatrzymywanie Styxxx'u :ocean: - ${user.toString()}`, 'stop critical!!!');
            setTimeout(async () => {
                Logger.log(interaction.client, `[${now}] Styxxx został zatrzymany :octagonal_sign: - ${user.toString()}`, 'stop critical!!!');
                await interaction.deleteReply();
                interaction.client.destroy();
            }, 30000);

        }
	},
};