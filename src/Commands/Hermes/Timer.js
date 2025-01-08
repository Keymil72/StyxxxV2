const { SlashCommandBuilder } = require("discord.js");

const Logger = require('../../Features/Logger.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timer')
        .setDescription('Ustawia czasomierz na określony czas w formacie 3d 4h 5m 6s')
        .addStringOption(option => option
            .setName("time")
            .setDescription('Czasomierz można wybrać 1 lub nie podać wcale co symbolizuje minuty')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("name")
            .setDescription('Nazwa timera')
            .setRequired(false)
        ),

    async execute(interaction) {
        // deklaracja stałych
        const client = interaction.client;
        let stringTime = interaction.options.getString('time');
        let name = interaction.options.getString('name') ? interaction.options.getString('name') : "-";
        let user = interaction.user;

        await interaction.reply({ content: `Trwa obliczanie przewidywanej daty`, ephemeral: true });
        stringTime = stringTime.toLowerCase().replace(/ /g, '');
        const days = stringTime.includes('d') ? parseInt(stringTime.split('d')[0]) : 0;
        const hours = stringTime.includes('h') ? parseInt(stringTime.split('h')[0]) : 0;
        let minutes = stringTime.includes('m') ? parseInt(stringTime.split('m')[0]) : 0;
        const seconds = stringTime.includes('s') ? parseInt(stringTime.split('s')[0]) : 0;
        if (!stringTime.includes("d") && !stringTime.includes("h") && !stringTime.includes("m") && !stringTime.includes("s")) {
            minutes = parseInt(stringTime);
        }

        let stopDateTime = new Date(Date.now() + (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000));

        const displayDateTime = GetDisplayDateTime(stopDateTime);

        if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
            await interaction.editReply({ content: `Nie podałeś czasu lub ma nieprawidłowy format`, ephemeral: true });
            return;
        }
        await interaction.editReply({ content: `Ustawiono timer "${name}" na ${displayDateTime}`, ephemeral: true });
        Logger.log(client, `Ustawiono timer "${name}" na ${stopDateTime}`, __filename);

        setTimeout(async () => {
            try{   
                await interaction.editReply({ content: `${user.toString()} Twój timer "${name}" zakończył się ${displayDateTime}`, ephemeral: true });  
            }catch(error){
                Logger.log(client, `Nie udało się wysłać wiadomości do ${user.toString()} o zakończeniu timera "${name}"`, __filename);
            }
            await user.send(`${user.toString()} Twój timer "${name}" zakończył się ${displayDateTime}`);
            let i = 0;
            setInterval(async () => {
                    if (i >= 3)
                    {
                        await interaction.deleteReply();
                        return;
                    }
                    try {
                    await interaction.editReply({ content: `${user.toString()} Twój timer "${name}" zakończył się ${++i}min temu`, ephemeral: true });
                }
                catch (error) {
                Logger.log(client, `Nie udało się wysłać wiadomości do ${user.toString()} o zakończeniu timera "${name}"`, __filename);
                }
            }, 1000 * 60);
            Logger.log(client, `Timer "${name}" zakończony ${user.toString()}`, __filename);
        }, stopDateTime - new Date());
    },
};

function GetDisplayDateTime(stopDateTime) {
    const day = stopDateTime.getDate() >= 10 ? stopDateTime.getDate() : `0${stopDateTime.getDate()}`;
    const month = stopDateTime.getMonth() >= 10 ? stopDateTime.getMonth() : `0${stopDateTime.getMonth() + 1}`;
    const hour = stopDateTime.getHours() >= 10 ? stopDateTime.getHours() : `0${stopDateTime.getHours()}`;
    const minute = stopDateTime.getMinutes() >= 10 ? stopDateTime.getMinutes() : `0${stopDateTime.getMinutes()}`;
    const second = stopDateTime.getSeconds() >= 10 ? stopDateTime.getSeconds() : `0${stopDateTime.getSeconds()}`;
    let DateTime = `${day}.${month}.${stopDateTime.getFullYear()} - ${hour}:${minute}:${second}`;

    return DateTime;
}