const { SlashCommandBuilder, VoiceState } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wstawaj')
		.setDescription('Rzucanie osobami po kanałach głosowych by je obudzić')
        .addUserOption(option => option
            .setName('user')
            .setDescription('Osoba do obudzenia')
            .setRequired(true)
            )
        .addIntegerOption(option => option
            .setName('time')
            .setDescription('Ilość powtórzeń (ilość < 1 - nieskończoność')
            .setRequired(true)
            ),

	async execute(interaction) {
        let member = interaction.member;
        const chLogs = interaction.client.channels.cache.get('826388081057333260');
        const ch = interaction.channel;
        const user = interaction.options.getUser('user');

        if (user != null){
            const target = await interaction.guild?.members.fetch(user.id);
            const baseChannel = target.voice.channel;

            if (baseChannel != null) {
                if  (user.id == ""){
                    await interaction.reply({ content: 'Osoba znajdue się na black liście', ephemeral: true});
                    return;
                }
                if (interaction.guild?.voiceStates.cache.get(user.id).mute){
                    let time = interaction.options.getInteger('time');
                    const ch1 = await interaction.guild?.channels.create({
                        name: `${target.displayName} - WAKEY`,
                        type: 2
                      })
                    const ch2 = await interaction.guild?.channels.create({
                        name: `${target.displayName} - WAKEY`,
                        type: 2
                      })
                    
                    if (time < 1) {
                        time = 1000;
                    }
                    await interaction.reply({ content: '```Rzucam!```', ephemeral: true});
                    var commandData = "``` " + interaction.commandName + " " + user.displayName + " " + user.id + " ```";

                    await chLogs.send(`Wykonano polecenie ↴ ${commandData} na polecenie ↴ ${member.toString()} \nna kanale ↴ ${ch.toString()}`);
                    for (let i = 0; i < time; i++) {
                        if (!interaction.guild?.voiceStates.cache.get(user.id).mute) break;
                        await target.voice.setChannel(ch1);
                        await wait(500);
                        await target.voice.setChannel(ch2);
                        await wait(500);

                    }
                    await target.voice.setChannel(baseChannel);
                    await ch1.delete();
                    await ch2.delete();
                }else {
                    await interaction.reply({ content: '```Podana osoba nie jest wyciszona!```', ephemeral: true});
                }
            }else {
                await interaction.reply({ content: '```Podana osoba nie znajduje się na kanale głosowym!```', ephemeral: true});
            }
        }else {
            await interaction.reply({ content: '```Nie odnaleziono osoby!```', ephemeral: true});
        }
	},
};