const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const moment = require("moment");
const fs = require("fs");
const path = require("path");

const logger = require('../../Features/Logger.js');

const { channelName, adminRole } = require('../../Events/Assets/Role.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-stworz')
        .setDescription(`Ustawia role na serwerze przypiwsując je do reakcji na wiadomości na kanale -  ${channelName}`)
        .addStringOption(option => option
            .setName('nazwa')
            .setDescription('Nazwa roli')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('emoji')
            .setDescription('Emoji (np. :smile:)')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('opis')
            .setDescription('Opis roli (co robi)')
            .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });

        const client = interaction.client;
        const member = interaction.member;
        if (!member.roles.cache.some(role => role.name === adminRole)) {
            logger.log(client, `Użytkownik "${member.user.username} #${member.id}" usiłował użyć komendy "${interaction.commandName}" nie mając do tego uprawnień.`);
            await interaction.deleteReply();
            return;
        }

        let ch = client.channels.cache.find(ch => ch.name === channelName);
        let chString = ch.isThread() ? `Wątek: ${ch.name}` : ch.toString();

        const name = interaction.options.getString('nazwa');
        const emoji = interaction.options.getString('emoji').trim();
        const description = interaction.options.getString('opis');

        let currentDate = moment.utc().format('DD.MM.YYYY HH:mm');
        let footer = "Wygenerowano: Styxxx -> Tworzenie roli     • " + currentDate;

        let embed = new EmbedBuilder()
            .setTitle(`${name} - ${description}`)
            .setDescription(`Dodaj reakcje -> ${emoji} <- na tą wiadomość aby dostać role ${name}`)
            .setColor('#00ff00')
            .setFooter({ text: footer });

        let message = await ch.send({ embeds: [embed] });
        await message.react(emoji);

        await interaction.deleteReply();

        const filePath = path.join('src', 'events', 'assets', 'Role.json');
        fs.readFile(filePath, 'utf8', (err, file) => {
            if (err) {
                logger.log(client, 'Error while writing the file:' + err + ` przez użytkownika: "${member.user.username} #${member.id}"`, 'botError');
                console.error('Error while reading the file:', err);
                return
            }
            try {
                let dataJson = JSON.parse(file)
                dataJson.reaction_role.push({ messageId: message.id, emoji: emoji, role: name });
                fs.writeFile(filePath, JSON.stringify(dataJson), (err) => {
                    if (err) {
                        logger.log(client, 'Error while writing the file:' + err + ` przez użytkownika: "${member.user.username} #${member.id}"`, 'botError');
                        console.error('Error while writing the file:', err);
                        return
                    }
                });
            } catch (err) {
                logger.log(client, 'Error while writing the file:' + err + ` przez użytkownika: "${member.user.username} #${member.id}"`);
                console.error('Error while parsing the file:', err);
            }
        });
        logger.log(client, `Dodano role: "${name}" do reakcji: "${emoji}" na wiadomości na kanale: ${ch.toString()} przez użytkownika: "${member.user.username} #${member.id}"`, 'critical');
    }
}