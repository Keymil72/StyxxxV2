const { Events, ActivityType } = require('discord.js');
const moment = require('moment');

const Logger = require('../../Features/Logger.js');
const EpicGames = require('../../Features/EpicGames.js');
const SheduledTask = require('../../Features/SheduledTask.js');
const { developmentMode } = require('../../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		if (!developmentMode){
			//NOTE - Logger done
			Logger.log(client, `${client.user.tag} znowu płynie - ${moment().format('DD-MM-YYYY hh:mm:ss')}`, __filename, 'Start -h');
		}
		else{
			//NOTE - Logger done
			Logger.log(client, `${client.user.tag} znowu płynie - ${moment().format('DD-MM-YYYY hh:mm:ss')}`, __filename, 'Start');
			Logger.log(client, `${client.user.tag} odpalony w trybie budowy! Czy jesteś tego pewien? Jeśli chcesz zmienić status użyj polecenia "/tryb-budowy <tak/nie> na dc."`, __filename, 'Start');
		}
		if (!developmentMode)
			client.user.setPresence({ activities: [{ name: '/pomoc', type: ActivityType.Listening }], status: 'online' });
		else
			client.user.setPresence({ activities: [{ name: 'W trakcie budowy /pomoc', type: ActivityType.Listening }], status: 'dnd' });

		console.log(`${client.user.tag} znowu płynie - ${moment().format('DD-MM-YYYY hh:mm:ss')}`);

		// uruchomienie SheduledTask
		SheduledTask.start(client);

		// wyświetla darmowe gry na kanale co godzinę
		setInterval(() => {
			if (!developmentMode)
				EpicGames.display(client);
		}, 1000 * 60 * 60);
	},
};