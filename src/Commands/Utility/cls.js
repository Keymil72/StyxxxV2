const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const { channelLogId } = require('../../config.json');
const { adminRole } = require('../../Events/Assets/Role.json');
const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cls')
        .setDescription('Komenda do czyścienia określonej liczby wiadomości')
        .addIntegerOption(option =>
            option.setName("message_amount")
                .setDescription('Liczba wiadomości do usunięcia')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("overload")
                .setDescription('Przeciążenie komendy')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // deklaracja zmiennych
        const client = interaction.client;
        let member = interaction.member;
        const ch = interaction.channel;
        // pobranie wartości z opcji
        const overload = await interaction.options.getString('overload') == null ? '' : interaction.options.getString('overload');
        const messageAmount = interaction.options.getInteger('message_amount');
        // jeśli kanał jest wątkiem, to zmień wyświetlany kanał na nazwę wątku
        let chString = ch.isThread() ? `Wątek: ${ch.name}` : ch.toString();
        // zmienna z danymi komendy
        var commandData = "``` " + interaction.commandName + " " + messageAmount + " " + overload + " ```";

        // sprawdzenie czy użytkownik ma uprawnienia do wykonania komendy i wysłanie logów
        if (!member.roles.cache.some(role => role.name === adminRole)) {
            await interaction.reply({ content: 'Nie masz uprawnień do wykonania tej komendy', ephemeral: true });
            Logger.log(interaction.client, `Użytkownik ${member.user.username} próbował wykonać komendę ${interaction.commandName} na kanale ${chString} - brak uprawnień`, 'error');
            return;
        }

        // sprawdzenie czy kanał jest kanałem logów lub czy użytkownik podał przeciążenie "-y"
        if (ch.id != channelLogId || overload.includes('-y')) {
            if (ch.isTextBased()) {
                let messagesDeleted = 0;
                if (messageAmount != null && messageAmount >= 1) {
                    await ch.messages.fetch({ limit: messageAmount }).then(messages => {
                        messages.forEach(message => {
                            if (message.deletable) {
                                let attachmentUrl = message.attachments.first() ? message.attachments.first().url : null;
                                Logger.log(interaction.client, `Usunięto wiadomość "${message.content}" z załącznikiem "${attachmentUrl}" na kanale ${chString} przez użytkownika ${member.user.username}`, 'msgContent');
                                message.delete()
                                messagesDeleted++;
                            }
                        });
                    });
                } else if (messageAmount == 0) {
                    await ch.messages.fetch().then(messages => {
                        messages.forEach(message => {
                            if (message.deletable) {
                                let attachmentUrl = message.attachments.first() ? message.attachments.first().url : null;
                                Logger.log(interaction.client, `Usunięto wiadomość "${message.content}" z załącznikiem "${attachmentUrl}" na kanale ${chString} przez użytkownika ${member.user.username}`, 'msgContent');
                                message.delete()
                                messagesDeleted++;
                            }
                        });
                    });
                }
                if (overload.includes("-h"))
                    Logger.log(interaction.client, `Użytkownik ${member.toString()} wykonał komendę ${commandData} na kanale ${chString}`, 'hiddencritical');
                else
                    Logger.log(interaction.client, `Użytkownik ${member.toString()} wykonał komendę ${commandData} na kanale ${chString}`, 'critical');
                
                Logger.log(client, `Usunięto ${messagesDeleted} wiadomości z kanału ${ch.toString()} przez ${member.toString()}`, 'info');
            } else {
                await interaction.reply({ content: 'Nie podano liczby wiadomości do usunięcia', ephemeral: true });
                Logger.log(interaction.client, `Użytkownik ${member.user.username} próbował wykonać komendę ${interaction.commandName} na kanale ${chString} - brak liczby wiadomości`, 'error');
                return;
            }
        } else {
            await interaction.reply({ content: 'Nie można usunąć wiadomości na tym kanale', ephemeral: true });
            Logger.log(interaction.client, `Użytkownik ${member.user.username} próbował wykonać komendę ${interaction.commandName} na kanale ${chString} - nie można usunąć wiadomości z tego kanału`, 'error');
            return;
        }
        await interaction.reply({ content: 'Ja tu tylko sprzątam... 🧹', ephemeral: true });

        var commandData = "``` " + interaction.commandName + " " + messageAmount + " ```";
    },
};