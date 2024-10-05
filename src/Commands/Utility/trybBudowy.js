const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

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
        if (mode == null){
            let message = `Tryb budowy Styxxxu jest ustawiony na ${developmentMode}`;
            await interaction.reply({ content: message, ephemeral: true });
            //NOTE - Logger done
            Logger.log(client, `Sprawdzono aktualny tryb budowy Styxxxu`, __filename);
            return;
        }

        if (developmentMode == mode){
            let message = `Tryb budowy Styxxxu jest już ustawiony na ${mode}`;
            //NOTE - Logger done
            Logger.log(client, `Próbowano zmienić aktualny tryb budowy Styxxxu na ten sam`, __filename, 'Critical');
            await interaction.reply({ content: message, ephemeral: true });
        }else{
            let message = `Tryb budowy Styxxxu został zmieniony na ${mode}`;
            jsonData.developmentMode = mode;
            fs.writeFileSync('../../config.json', JSON.stringify(jsonData, null, 2));
            await interaction.reply({ content: message, ephemeral: true });
            //NOTE - Logger done
            Logger.log(client, `Sprawdzono zmieniono tryb budowy z ${developmentMode} na ${mode}`, __filename, 'Critical');
        }
    },
};