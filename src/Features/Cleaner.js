const Logger = require('./Logger.js');

// usuwa wiadomość po 15 sekundach, a następnie usuwa odpowiedź po 2 sekundach
async function cleanReply(interaction) {
    //edytujemy odpowiedź po 15 sekundach
    setTimeout(async () => {
        // usuwamy odpowiedź po 2 sekundach
        setTimeout(async () => {
            await interaction.deleteReply();
        }, 2000);
        await interaction.editReply('Ja tu tylko sprzątam... 🧹');
    }, 15000);
}

// loguje i usuwa wiadomość po 15 sekundach
async function cleanMessage(message) {
    // sprawdzenie czy wiadomość istnieje
    if (message) {
        // edycja wiadomości po 15 sekundach
        setTimeout(async () => {
            // usunięcie wiadomości po 2 sekundach
            setTimeout(async () => {
                // próba usunięcia wiadomości i zgłoszenie błędu w przypadku niepowodzenia
                try {
                    let attachmentUrl = message.attachments.first() ? message.attachments.first().url : null;
                    let ApolloEmbed = message?.embeds?.length ? message.embeds[0]?.author?.name : null;
                    Logger.log(message.client, `Usuwam wiadomość "${message.content}" z załącznikiem "${attachmentUrl}" z Apollo embed "${ApolloEmbed}" na kanale ${message.channel}`, 'msgContent Cleaner.cleanMessage');
                    await message.delete();
                }catch (error){
                    Logger.log(message.client, `Błąd podczas usuwania wiadomości na kanale ${message.channel} - ${error}`, 'dev error Cleaner.cleanMessage');
                }
            }, 2000);
            // próba edycji wiadomości i zgłoszenie błędu w przypadku niepowodzenia
            try {
                await message.edit('Ja tu tylko sprzątam... 🧹');
            }catch (error){
                Logger.log(message.client, `Błąd podczas edycji wiadomości na kanale ${message.channel} - ${error}`, 'dev error Cleaner.cleanMessage');
            }
        }, 15000);
    }
}

module.exports = { cleanReply, cleanMessage };