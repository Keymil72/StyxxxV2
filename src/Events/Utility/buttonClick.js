const { EmbedBuilder, Events, InteractionType } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    // nazwa zdarzenia
    name: Events.InteractionCreate,
    // czy zdarzenie ma być wykonane tylko raz czy wielokrotnie
    once: false,
    async execute(interaction) {
        if (interaction.member.bot) return;
        if (interaction.type == InteractionType.MessageComponent) {
            await interaction.deferUpdate();
            const customId = JSON.parse(interaction.customId);
            const buttonName = customId.ffb;
            const queue = useQueue(interaction.guild);
            if (buttonName) {
                delete require.cache[require.resolve(`../../Buttons/${buttonName}.js`)];
                const button = require(`../../Buttons/${buttonName}.js`);
                if (button) return button({ interaction, queue });
            }
        }
    },
};