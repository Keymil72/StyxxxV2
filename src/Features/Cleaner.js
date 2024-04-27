const Logger = require('./Logger.js');
const msgWLIds = require('./msgWLIds.js');
const path = require('path');

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
    if (message){
        // sprawdzenie czy wiadomość nie jest na liście wykluczeń oczywiście callbackiem hehe
        msgWLIds.zawieraWiadomosc(message, (result) => {
            // jeśli nie jest na liście wykluczeń
            if (!result){
                // edycja wiadomości po 15 sekundach
                setTimeout(async () => {
                    // usunięcie wiadomości po 2 sekundach
                    setTimeout(async () => {
                        // próba usunięcia wiadomości i zgłoszenie błędu w przypadku niepowodzenia
                        try {
                            let attachmentUrl = message.attachments.first() ? message.attachments.first().url : null;
                            let ApolloEmbed = message?.embeds?.length ? message.embeds[0]?.author?.name : null;
                            //NOTE - Logger done
                            Logger.log(message.client, `Usuwam wiadomość "${message.content}" z załącznikiem "${attachmentUrl}" z Apollo embed "${ApolloEmbed}" na kanale ${message.channel}`, `${path.dirname}/${path.basename}`, 'Content');
                            await message.delete();
                        }catch (error){
                            //NOTE - Logger done
                            Logger.log(message.client, `Błąd podczas usuwania wiadomości na kanale ${message.channel} - ${error}`, `${path.dirname}/${path.basename}`, 'Error');
                        }
                    }, 2000);
                    // próba edycji wiadomości i zgłoszenie błędu w przypadku niepowodzenia
                    try {
                        await message.edit('Ja tu tylko sprzątam... 🧹');
                    }catch (error){
                        //NOTE - Logger done
                        Logger.log(message.client, `Błąd podczas edycji wiadomości na kanale ${message.channel} - ${error}`, `${path.dirname}/${path.basename}`, 'Error');
                    }
                }, 15000);
            }
        });
    }
}

module.exports = { cleanReply, cleanMessage };