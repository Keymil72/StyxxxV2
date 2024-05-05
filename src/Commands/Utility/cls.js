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
        const commandData = "``` " + interaction.commandName + " " + messageAmount + " " + overload + " ```";

        // sprawdzenie czy użytkownik ma uprawnienia do wykonania komendy i wysłanie logów
        if (!member.roles.cache.some(role => role.name === adminRole)) {
            await interaction.reply({ content: 'Nie masz uprawnień do wykonania tej komendy', ephemeral: true });
            //NOTE - Logger done
            Logger.log(interaction.client, `Użytkownik ${member.user.username} próbował wykonać komendę ${interaction.commandName} na kanale ${chString} - brak uprawnień`, __filename, 'permission Error');
            return;
        }

        // sprawdzenie czy kanał jest kanałem logów lub czy użytkownik podał przeciążenie "-y"
        if (ch.id != channelLogId || overload.includes('-y')) {
            if (ch.isTextBased()) {
                // licznik usuniętych wiadomości
                let messagesDeleted = 0;
                // sprawdzenie czy podano ilość wiadomości do usunięcia, która jest >= 1
                if (messageAmount != null && messageAmount >= 1) {
                    // pobranie podanej ilości wiadomości z kanału
                    await ch.messages.fetch({ limit: messageAmount }).then(messages => {
                        // usuwanie pobranych wiadomości
                        messages.forEach(message => {
                            // sprawdzenie czy wiadomość da się usunąć
                            if (message.deletable) {
                                // stworzenie logów wiadomości
                                let attachmentUrl = message.attachments.first() ? message.attachments.first().url : null;
                                //NOTE - Logger done
                                Logger.log(interaction.client, `Usunięto wiadomość "${message.content}" z załącznikiem "${attachmentUrl}" na kanale ${chString} przez użytkownika ${member.user.username}`, __filename, 'Content');
                                message.delete()
                                messagesDeleted++;
                            }
                        });
                    });
                // sprawdzenie czy użytkownik chce usunąć całą historię wiadomości na kanale
                } else if (messageAmount == 0) {
                    // pobranie wszystkich wiadomości z kanału
                    await ch.messages.fetch().then(messages => {
                        // usuwanie wszystkich wiadomości
                        messages.forEach(message => {
                            // sprawdzenie czy da się usunąć wiadomość
                            if (message.deletable) {
                                // stworzenie logów wiadomości
                                let attachmentUrl = message.attachments.first() ? message.attachments.first().url : null;
                                //NOTE - Logger done
                                Logger.log(interaction.client, `Usunięto wiadomość "${message.content}" z załącznikiem "${attachmentUrl}" na kanale ${chString} przez użytkownika ${member.user.username}`, __filename, 'Content');
                                message.delete()
                                messagesDeleted++;
                            }
                        });
                    });
                }
                //NOTE - Logger done
                Logger.log(interaction.client, `Użytkownik ${member.toString()} wykonał komendę ${commandData} na kanale ${chString}`, __filename, 'log -h');

                // stworzenie logów o ilości usuniętych wiadomościach
                if (overload.includes("-h"))
                    //NOTE - Logger done
                    Logger.log(client, `Usunięto ${messagesDeleted} wiadomości z kanału ${ch.toString()} przez ${member.toString()}`, __filename, 'log -h');
                else
                    //NOTE - Logger done
                    Logger.log(client, `Usunięto ${messagesDeleted} wiadomości z kanału ${ch.toString()} przez ${member.toString()}`, __filename);
            } else {
                // odpowiedź na błędną ilość wiadomości do usunięcia
                await interaction.reply({ content: 'Nie podano liczby wiadomości do usunięcia', ephemeral: true });
                //NOTE - Logger done
                Logger.log(interaction.client, `Użytkownik ${member.user.username} próbował wykonać komendę ${interaction.commandName} na kanale ${chString} - brak liczby wiadomości`, __filename, 'permission Error');
                return;
            }
        } else {
            // odpowiedź na brak odpowiedniego argumentu przeciążenia dla kanału logów
            await interaction.reply({ content: 'Nie można usunąć wiadomości na tym kanale', ephemeral: true });
            //NOTE - Logger done
            Logger.log(interaction.client, `Użytkownik ${member.user.username} próbował wykonać komendę ${interaction.commandName} na kanale ${chString} - nie można usunąć wiadomości z tego kanału`, __filename, 'permission Error');
            return;
        }
        // odpowiedz na wykonanie komendy
        await interaction.reply({ content: 'Ja tu tylko sprzątam... 🧹', ephemeral: true });
    },
};