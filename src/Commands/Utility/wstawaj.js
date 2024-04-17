const { SlashCommandBuilder, VoiceState } = require("discord.js");
const Logger = require('../../Features/Logger.js');
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
        // deklaracja stałych
        const member = interaction.member;
        const chLogs = interaction.client.channels.cache.get('826388081057333260');
        const ch = interaction.channel;
        const user = interaction.options.getUser('user');
        // sprawdzenie czy użytkownik istnieje
        if (user){
            // zmiana użytkownika na target
            const target = await interaction.guild?.members.fetch(user.id);
            // pobranie kanału z którego został przeniesiony
            const baseChannel = target.voice.channel;

            // sprawdzenie czy bazowy kanał istnieje
            if (baseChannel) {
                // dokończyć - dodać admina z konfigu!!!
                if  (user.id == ""){
                    await interaction.reply({ content: 'Osoba znajdue się na black liście', ephemeral: true});
                    return;
                }
                // sprawdzenie czy target jest aktualnie na kanale głosowym
                if (interaction.guild?.voiceStates.cache.get(user.id).mute){
                    // pobranie wartości z opcji
                    let time = interaction.options.getInteger('time');
                    // stworzenie dwóch kanałów do przemieszczania osoby
                    const ch1 = await interaction.guild?.channels.create({
                        name: `${target.displayName} - WAKEY`,
                        type: 2
                      })
                    const ch2 = await interaction.guild?.channels.create({
                        name: `${target.displayName} - WAKEY`,
                        type: 2
                      })
                    
                    // sprawdzenie czy ilość jest < 1
                    if (time < 1) {
                        time = 1000;
                    }
                    // odpowiedź o rozpoczęciu
                    await interaction.reply({ content: '```Rzucam!```', ephemeral: true});
                    var commandData = "``` " + interaction.commandName + " " + user.displayName + " " + user.id + " ```";

                    await Logger.log(client, `Wykonano polecenie ↴ ${commandData} na polecenie ↴ ${member.toString()} \nna kanale ↴ ${ch.toString()}`, 'wstawaj info');
                    // pętla przemieszczająca osobę
                    for (let i = 0; i < time; i++) {
                        // sprawdzenie czy osoba nie została odciszona
                        if (!interaction.guild?.voiceStates.cache.get(user.id).mute) break;
                        // sprawdzenie czy użytkownik nie wyszedł z kanałów głosowych
                        if(!interaction.user) {
                            await interaction.editReply({ content: '```Podana osoba się zatopiła!```', ephemeral: true});
                            break;
                        }
                        // przemieszczenie osoby
                        await target.voice.setChannel(ch1);
                        await wait(500);
                        await target.voice.setChannel(ch2);
                        await wait(500);

                    }
                    // przemieszczenie osoby na bazowy kanał po wykonaniu pętli lub odciszeniu
                    await target.voice.setChannel(baseChannel);
                    await ch1.delete();
                    await ch2.delete();
                }else {
                    // odpowiedź o braku wyciszenia
                    await interaction.reply({ content: '```Podana osoba nie jest wyciszona!```', ephemeral: true});
                }
            }else {
                // odpowiedź o braku osoby na kanale głosowym
                await interaction.reply({ content: '```Podana osoba nie znajduje się na kanale głosowym!```', ephemeral: true});
            }
        }else {
            // odpwiedź o braku osoby
            await interaction.reply({ content: '```Nie odnaleziono osoby!```', ephemeral: true});
        }
	},
};