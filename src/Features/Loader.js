const { readdirSync } = require('fs');
const { useMainPlayer } = require('discord-player');
const player = useMainPlayer()


const PlayerEvents = readdirSync('./src/Events/Apollo').filter(file => file.endsWith('.js'));

for (const file of PlayerEvents) {
    const PlayerEvent = require(`../Events/Apollo/${file}`);
    console.log(`-> [załadowano eventy playera] ${file.split('.')[0]}`);
    player.events.on(file.split('.')[0], PlayerEvent.bind(null));
    delete require.cache[require.resolve(`../Events/Apollo/${file}`)];
};