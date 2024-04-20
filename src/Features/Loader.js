const { readdirSync } = require('fs');
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer()

// lista plików eventów playera - Apollo
const PlayerEvents = readdirSync('./src/Events/Apollo').filter(file => file.endsWith('.js'));

// załadowanie eventów playera - Apollo
for (const file of PlayerEvents) {
    const PlayerEvent = require(`../Events/Apollo/${file}`);
    player.events.on(file.split('.')[0], PlayerEvent.bind(null));
    delete require.cache[require.resolve(`../Events/Apollo/${file}`)];
};