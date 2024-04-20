const { SlashCommandBuilder } = require("discord.js");
const Logger = require('../../Features/Logger.js');
const wait = require('node:timers/promises').setTimeout;
const { adminId } = require('../../config.json');

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
        const ch = interaction.channel;
        const user = interaction.options.getUser('user');

        // sprawdzenie czy osoba jest użytkownikiem
        if (user && !user?.bot) {
            // wykonanie metody
            await this.handleValidUser(interaction, user, member, ch);
        } else {
            // odpowiedź na błąd
            await interaction.reply({ content: 'Nie odnaleziono osoby lub jest ona botem :robot:!', ephemeral: true });
            Logger.log(interaction.client, `Nie odnaleziono osoby lub jest ona botem :robot:! - ${user.toString()}`, 'dev info wstawaj');
        }
    },

    async handleValidUser(interaction, user, member, ch) {
        // deklaracja stałych
        const target = await interaction.guild?.members.fetch(user.id);
        const baseChannel = target.voice.channel;

        // sprawdzenie czy osoba jest na kanale głosowym
        if (baseChannel) {
            // sprawdzenie czy osoba jest na czarnej liście i odpowiedź
            if (user.id == adminId) {
                await interaction.reply({ content: 'Osoba znajdue się na black liście', ephemeral: true });
                return;
            }

            // sprawdzenie czy osoba jest wyciszona
            if (interaction.guild?.voiceStates.cache.get(user.id).mute) {
                // deklaracja ilości powtórzeń
                let time = interaction.options.getInteger('time');
                if (time < 1) {
                    time = 1000;
                }

                // odpowiedź na polecenie i stworzenie logów
                await interaction.reply({ content: '```Rzucam!```', ephemeral: true });
                const commandData = "``` " + interaction.commandName + " " + user.displayName + " " + user.id + " ```";

                await Logger.log(client, `Wykonano polecenie ↴ ${commandData} na polecenie ↴ ${member.toString()} \nna kanale ↴ ${ch.toString()}`, 'wstawaj info');

                // wykonanie metody
                await this.moveUserRepeatedly(interaction, target, time);

                // przeniesienie osoby na kanał bazowy
                if (target?.voice?.channel != null)
                    await target.voice.setChannel(baseChannel);

                // usuwanie kanałów
                await this.deleteChannels(interaction, "- WAKEY");
            } else {
                // odpowiedź na błąd
                await interaction.reply({ content: '```Podana osoba nie jest wyciszona!```', ephemeral: true });
            }
        } else {
            // odpowiedź na błąd
            await interaction.reply({ content: '```Podana osoba nie znajduje się na kanale głosowym!```', ephemeral: true });
        }
    },


    async moveUserRepeatedly(interaction, target, time) {
        // deklaracja stałych kanalów
        const ch1 = await interaction.guild?.channels.create({
            name: `${target.displayName} - WAKEY`,
            type: 2
        });
        const ch2 = await interaction.guild?.channels.create({
            name: `${target.displayName} - WAKEY`,
            type: 2
        });

        // przeniesienie osoby po kanałach
        for (let i = 0; i < time; i++) {
            // przerwanie pętli jeśli osoba nie jest wyciszona
            if (!interaction.guild?.voiceStates.cache.get(target.id).mute) break;
            // przerwanie pętli jeśli osoba nie jest na kanale głosowym
            if (!interaction.user) {
                await interaction.editReply({ content: '```Podana osoba się zatopiła!```', ephemeral: true });
                break;
            }
            // przeniesienie osoby po kanałach
            if (target?.voice?.channel != null)
                await target.voice.setChannel(ch1);
            await wait(500);
            if (target?.voice?.channel != null)
                await target.voice.setChannel(ch2);
            await wait(500);
        }
    },

    async deleteChannels(interaction, channelName) {
        const channels = interaction.guild?.channels.cache.filter(channel => channel.name.includes(channelName));
        await Promise.all(channels.map(channel => channel.delete()));
    }
};