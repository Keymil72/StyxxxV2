
async function cleanReply(interaction) {
    setTimeout(async () => {
        setTimeout(async () => {
            await interaction.deleteReply();
        }, 2000);
        await interaction.editReply('Ja tu tylko sprzątam... 🧹');
    }, 15000);
}

async function cleanMessage(message) {
    setTimeout(async () => {
        setTimeout(async () => {
            await message.delete();
        }, 2000);
        await message.edit('Ja tu tylko sprzątam... 🧹');
    }, 15000);
}

module.exports = { cleanReply, cleanMessage };