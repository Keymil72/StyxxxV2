const { SlashCommandBuilder, ActivityType, PermissionFlagsBits } = require("discord.js");

const Logger = require('../../Features/Logger.js');
const fs = require('fs');
const jsonData = require('../../config.json');
const { developmentMode } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tryb-budowy')
        .setDescription('Zmiana trybu bota')
        .addBooleanOption(option => option
            .setName('mode')
            .setDescription('Czy bot ma być w trybie budowy?')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // deklaracja stałych
        const client = interaction.client;
        const mode = interaction.options.getBoolean('mode');
        if (developmentMode == mode){
            let message = `Tryb budowy Styxxxu jest już ustawiony na ${mode}`;
            //NOTE - Logger done
            Logger.log(client, `Próbowano zmienić aktualny tryb budowy Styxxxu na ten sam`, __filename, 'Critical');
            await interaction.reply({ content: message, ephemeral: true });
        }else{
            let name = mode ? '/pomoc' : 'W trakcie budowy /pomoc';
            let status = mode ? 'online' : 'dnd';
            let message = `Tryb budowy Styxxxu został zmieniony na ${mode}`;
            jsonData.developmentMode = mode;
            fs.writeFileSync('../../config.json', JSON.stringify(jsonData, null, 2));
            await interaction.reply({ content: message, ephemeral: true });
            client.user.setPresence({ activities: [{ name: name, type: ActivityType.Listening }], status: status });
            //NOTE - Logger done
            Logger.log(client, `Sprawdzono zmieniono tryb budowy z ${developmentMode} na ${mode}`, __filename, 'Critical');
        }
    },
};