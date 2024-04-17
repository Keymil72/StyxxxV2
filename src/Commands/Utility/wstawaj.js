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
        const member = interaction.member;
        const ch = interaction.channel;
        const user = interaction.options.getUser('user');

        if (user && !user?.bot) {
            await this.handleValidUser(interaction, user, member, ch);
        } else {
            await interaction.reply({ content: 'Nie odnaleziono osoby lub jest ona botem :robot:!', ephemeral: true });
            Logger.log(interaction.client, `Nie odnaleziono osoby lub jest ona botem :robot:! - ${user.toString()}`, 'dev info wstawaj');
        }
    },

    async handleValidUser(interaction, user, member, ch) {
        const target = await interaction.guild?.members.fetch(user.id);
        const baseChannel = target.voice.channel;

        if (baseChannel) {
            if (user.id == adminId) {
                await interaction.reply({ content: 'Osoba znajdue się na black liście', ephemeral: true });
                return;
            }

            if (interaction.guild?.voiceStates.cache.get(user.id).mute) {
                let time = interaction.options.getInteger('time');
                if (time < 1) {
                    time = 1000;
                }

                await interaction.reply({ content: '```Rzucam!```', ephemeral: true });
                const commandData = "``` " + interaction.commandName + " " + user.displayName + " " + user.id + " ```";

                await Logger.log(client, `Wykonano polecenie ↴ ${commandData} na polecenie ↴ ${member.toString()} \nna kanale ↴ ${ch.toString()}`, 'wstawaj info');

                await this.moveUserRepeatedly(interaction, target, time);

                await target.voice.setChannel(baseChannel);
                await this.deleteChannels(interaction, baseChannel);
            } else {
                await interaction.reply({ content: '```Podana osoba nie jest wyciszona!```', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: '```Podana osoba nie znajduje się na kanale głosowym!```', ephemeral: true });
        }
    },


    async moveUserRepeatedly(interaction, target, time) {
        const ch1 = await interaction.guild?.channels.create({
            name: `${target.displayName} - WAKEY`,
            type: 2
        });
        const ch2 = await interaction.guild?.channels.create({
            name: `${target.displayName} - WAKEY`,
            type: 2
        });

        for (let i = 0; i < time; i++) {
            if (!interaction.guild?.voiceStates.cache.get(target.id).mute) break;
            if (!interaction.user) {
                await interaction.editReply({ content: '```Podana osoba się zatopiła!```', ephemeral: true });
                break;
            }
            await target.voice.setChannel(ch1);
            await wait(500);
            await target.voice.setChannel(ch2);
            await wait(500);
        }

        await ch1.delete();
        await ch2.delete();
    },

    async deleteChannels(interaction, baseChannel) {
        const channels = interaction.guild?.channels.cache.filter(channel => channel.type === 'GUILD_VOICE' && channel.name.includes(baseChannel.name));
        await Promise.all(channels.map(channel => channel.delete()));
    }
};