const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const msgWLIds = require('../../Features/msgWLIds.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription("ustawienie panelu kontrolnego dla muzyki")
        .addChannelOption(option => option
            .setName('kanal')
            .setDescription('kanal, na ktorym chcesz wyswietlic panel kontrolny')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) { 
        let Channel = interaction.options.getChannel('kanal');
        await interaction.deferReply();
        if (Channel.type !== 0) return interaction.editReply({ content: `Trzeba oznaczyć kanał ❌`, ephemeral: true})
        
    
        const embed = new EmbedBuilder()
            .setTitle('Lutnia - Panel Kontrolny 🎧')
            .setImage(interaction.guild.iconURL({ size: 4096, dynamic: true }))
            .setColor('#2f3136')
            .setFooter({ text: 'Funkcja Apollo -> Styxxx Bot', iconURL: interaction.member.avatarURL({ dynamic: true })})


        await interaction.editReply({ content: `Lutnia wysłana na kanał ${Channel}... ✅`, ephemeral: true})

        const Back = new ButtonBuilder()
            .setLabel('Poprzedni')
            .setCustomId(JSON.stringify({ffb: 'Back'}))
            .setStyle('Primary')

        const skip = new ButtonBuilder()
            .setLabel('Następny')
            .setCustomId(JSON.stringify({ffb: 'Skip'}))
            .setStyle('Primary')

        const resumepause = new ButtonBuilder()
            .setLabel('pauza / wznowienie')
            .setCustomId(JSON.stringify({ffb: 'ResumePause'}))
            .setStyle('Danger')

        const save = new ButtonBuilder()
            .setLabel('Nazwa utworu?')
            .setCustomId(JSON.stringify({ffb: 'SaveTrack'}))
            .setStyle('Success')

        const volumeup = new ButtonBuilder()
            .setLabel('Podgłośnij')
            .setCustomId(JSON.stringify({ffb: 'VolumeUp'}))
            .setStyle('Primary')

        const volumedown = new ButtonBuilder()
            .setLabel('Przycisz')
            .setCustomId(JSON.stringify({ffb: 'VolumeDown'}))
            .setStyle('Primary')

        const loop = new ButtonBuilder()
            .setLabel('Zapętlenie')
            .setCustomId(JSON.stringify({ffb: 'Loop'}))
            .setStyle('Danger')

        const np = new ButtonBuilder()
            .setLabel('Aktualnie odtwarzane?')
            .setCustomId(JSON.stringify({ffb: 'NowPlaying'}))
            .setStyle('Secondary')
         
        const queuebutton = new ButtonBuilder()
            .setLabel('Kolejka')
            .setCustomId(JSON.stringify({ffb: 'Queue'}))
            .setStyle('Secondary')

        const lyrics = new ButtonBuilder()
            .setLabel('Słowa utworu - rap genius')
            .setCustomId(JSON.stringify({ffb: 'Lyrics'}))
            .setStyle('Primary')

        const shuffle = new ButtonBuilder()
            .setLabel('Przestawienie kolejki')
            .setCustomId(JSON.stringify({ffb: 'Shuffle'}))
            .setStyle('Success')

        const stop = new ButtonBuilder()
            .setLabel('Spadaj!')
            .setCustomId(JSON.stringify({ffb: 'Stop'}))
            .setStyle('Danger')


        const row1 = new ActionRowBuilder().addComponents(Back, queuebutton, resumepause, np, skip)
        const row2 = new ActionRowBuilder().addComponents(volumedown, loop, save, volumeup)
        const row3 = new ActionRowBuilder().addComponents(lyrics, shuffle, stop)


        let msg = await Channel.send({ embeds: [embed], components: [row1, row2, row3] });
        msgWLIds.dodaj(msg)
    },
}
