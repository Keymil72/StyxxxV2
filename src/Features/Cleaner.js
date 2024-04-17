const Logger = require('./Logger.js');

async function cleanReply(interaction) {
    setTimeout(async () => {
        setTimeout(async () => {
            await interaction.deleteReply();
        }, 2000);
        await interaction.editReply('Ja tu tylko sprzątam... 🧹');
    }, 15000);
}

async function cleanMessage(message) {
    if (message != null) {
        setTimeout(async () => {
            setTimeout(async () => {
                try {
                    let attachmentUrl = message.attachments.first() ? message.attachments.first().url : null;
                    let ApolloEmbed = message?.embeds?.length ? message.embeds[0]?.author?.name : null;
                    Logger.log(message.client, `Usuwam wiadomość "${message.content}" z załącznikiem "${attachmentUrl}" z Apollo embed "${ApolloEmbed}" na kanale ${message.channel}`, 'msgContent Cleaner.cleanMessage');
                    await message.delete();
                }catch (error){
                    Logger.log(message.client, `Błąd podczas usuwania wiadomości na kanale ${message.channel} - ${error}`, 'dev error Cleaner.cleanMessage');
                }
            }, 2000);
            try {
                await message.edit('Ja tu tylko sprzątam... 🧹');
            }catch (error){
                Logger.log(message.client, `Błąd podczas edycji wiadomości na kanale ${message.channel} - ${error}`, 'dev error Cleaner.cleanMessage');
            }
        }, 1500);
    }
}

module.exports = { cleanReply, cleanMessage };