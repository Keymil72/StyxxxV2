const ms = require('ms');
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue  } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('przeskoczdo-czas')
        .setDescription('Czas do przeskoczenia w utworze')
        .addStringOption(option => option
            .setName('czas')
            .setDescription('Czas np. 5s, 10s, 20s, 1m, 7m')
            .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

const queue = useQueue(interaction.guild);

        if (!queue || !queue.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ${interaction.editReply}... ❌`, ephemeral: true });

        const timeToMS = ms(interaction.options.getString('czas'));

        if (timeToMS >= queue.currentTrack.durationMS) return interaction.editReply({ content:`Podany czas przekroczył długość utworu ${interaction.member}... ❌\nUżyj np. 5s, 10s, 20s, 1m, 7m`, ephemeral: true });

        await queue.node.seek(timeToMS);

        const SeekEmbed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({name: `Ustawiono moment odtwarzania akutalnego utworu na ${ms(timeToMS, { long: true })} ✅`})


        interaction.editReply({ embeds: [SeekEmbed] });
    },
};