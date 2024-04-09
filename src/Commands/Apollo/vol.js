const { SlashCommandBuilder } = require('discord.js');
const { useQueue  } = require('discord-player');

const { maxVol } = require('../../apolloConfig.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vol')
        .setDescription('Zmiana głośności')
        .addIntegerOption(option => option
            .setName('glosnosc')
            .setDescription('Głośność od 1 do 100')
            .setMinValue(1)
            .setMaxValue(maxVol)
            .setRequired(false)
        ),

    async execute(interaction) {
        await interaction.deferReply();

const queue = useQueue(interaction.guild);

        if (!queue) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ${interaction.member}... ❌`, ephemeral: true });
        const vol = interaction.options.getInteger('glosnosc')

        if (!vol) return interaction.editReply({ content: `Aktualna głośność to ${queue.node.volume}/${maxVol}% 🔊`, ephemeral: true });

        if (queue.node.volume === vol) return interaction.editReply({ content: `Próbujesz ustawić głośność na aktualną ${interaction.member}... ❌`, ephemeral: true });

        const success = queue.node.setVolume(vol);

       return interaction.editReply({ content: success ? `Głośność zmieniona na ${vol}/${maxVol}% 🔊` : `Nieoczekiwany błąd przy zmianie głośności ${interaction.member}... ❌` });
    },
};