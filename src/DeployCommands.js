const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// pobiera wszystkie foldery z komendami z folderu "Commands"
const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// pobiera wszystkie pliki komend z folderu "Commands"
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// pobiera dane komendy z pliku i dodaje do tablicy "commands"
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] Komenda ${filePath} nie zawiera własności "data" lub "execute".`);
		}
	}
}

// tworzy nową instancję REST i ustawia token
const rest = new REST().setToken(token);


// usuwa wszystkie komendy z serwera
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Usunięto wszystkie komendy aplikacji.'))
	.catch(console.error);

// usuwa wszystkie komendy z aplikacji (globalne)
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Usunięto wszystkie komendy aplikacji.'))
	.catch(console.error);

// tworzy nowe komendy na serwerze
(async () => {
	try {
		console.log(`Wczytywanie ${commands.length} komend aplikacji (/) komendy.`);

		// metoda put jest używana do pełnego odświeżenia wszystkich komend na serwerze z obecnym zestawem
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Wczytano ${data.length} komend aplikacji (/) komendy.`);
	} catch (error) {
		// złapanie i zalogowanie błędów
		console.error(error);
	}
})();