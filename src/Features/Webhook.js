// Moduł do pobierania webhooka z podanego kanału
async function pobierz(channel) {
    // Pobierz webhooki z podanego kanału
    const webhooks = await channel.fetchWebhooks();
    // Zwróć pierwszy webhook (nie planuję że będzie więcej niż jeden)
    return webhooks.first();
}

module.exports = { pobierz };