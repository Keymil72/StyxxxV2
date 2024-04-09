const { Events, ActivityType } = require('discord.js');
const moment = require('moment');

const Logger = require('../../Features/Logger.js');
const { developmentMode } = require('../../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		if (!developmentMode)
			Logger.log(client, `${client.user.tag} znowu płynie - ${moment().format('DD-MM-YYYY hh:mm:ss')}`, 'info');
		else
			Logger.log(client, `${client.user.tag} znowu płynie - ${moment().format('DD-MM-YYYY hh:mm:ss')}`, 'devinfo');
		
		if (!developmentMode)
			client.user.setPresence({ activities: [{ name: '/pomoc', type: ActivityType.Listening }], status: 'online' });
		else
			client.user.setPresence({ activities: [{ name: 'W trakcie budowy /pomoc', type: ActivityType.Custom }], status: 'dnd' });
	},
};