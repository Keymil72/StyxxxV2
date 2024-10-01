const { Events } = require('discord.js');

const Logger = require('../../Features/Logger.js');
const Index = require('../../index.js');

//poprawić clienta 
module.exports = {
	name: Events.Error,
	once: false,
	execute(error) {
		const client = index.client;
        let errorMessage = error.toString();
		//NOTE - Logger done
        Logger.log(client, errorMessage, __filename, "error");
		Index.start();
	},
};