const { Player } = require('discord-player');
const Genius = require("genius-lyrics");
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const { token } = require('./config.json');
const { discordPlayer } = require('./config.json');

// stworzenie klienta
global.client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// dodanie komend
client.commands = new Collection();
const commandFoldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

// pobiera wszystkie foldery z komendami z folderu "Commands"
for (const folder of commandFolders) {
	const commandsPath = path.join(commandFoldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// pobiera dane komendy z pliku i dodaje do tablicy "commands"
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// jeśli komenda zawiera dane i funkcję "execute" to dodaje do kolekcji w przeciwnym wypadku wyświetla ostrzeżenie
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// dodanie eventów
const eventFoldersPath = path.join(__dirname, 'Events');
const eventFolders = fs.readdirSync(eventFoldersPath);

// pobiera wszystkie foldery z eventami z folderu "Events"
for (const folder of eventFolders) {
	const eventsPath = path.join(eventFoldersPath, folder);
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	// pobiera dane eventu z pliku i dodaje do kolekcji eventów
	for (const file of eventFiles) {
		const eventFilePath = path.join(eventsPath, file);
		const event = require(eventFilePath);
		// jeśli event.once jest true to dodaje event jako once w przeciwnym wypadku jako on (once - jednorazowy event, on - wielokrotny event)
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}

	}
}

// obsługa komend
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	// jeśli nie ma komendy to wyświetla błąd
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	// próbuje wykonać komendę
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		// jeśli odpowiedź lub odpowiedź z opóźnieniem została już wysłana to wysyła odpowiedź z błędem jako odpowiedź z opóźnieniem
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


const player = new Player(client, discordPlayer);
global.genius = new Genius.Client();
player.extractors.loadDefault();

require("./Features/Loader.js");
//logowanie bota
client.login(token);

/* 
setting up watch file 
fs.watch('./src/features/assets/Lobby.json', { interval: 1000 }, (curr, prev) => {
	lolLobby.updateLobby(client);
});
*/
module.exports = { client };