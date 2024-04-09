
async function pobierz(channel) {
    const webhooks = await channel.fetchWebhooks();
    return webhooks.first();
}

module.exports = { pobierz };