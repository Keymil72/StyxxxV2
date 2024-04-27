const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

// moduł eksportuje komendę przeskoczdo-kolejka
module.exports = {
    data: new SlashCommandBuilder()
        .setName('przeskoczdo-kolejka')
        .setDescription('Przeskakuje kolejkę do podanego utworów (2 sposoby)')
        .addStringOption(option => option
            .setName('utwor')
            .setDescription('Nazwa lub link do utworu')
            .setRequired(false)
        )
        .addNumberOption(option => option
            .setName('numer')
            .setDescription('Miejsce w kolejce utworu')
            .setRequired(false)
        ),

    async execute(interaction) {
        // odłożenie odpowiedzi
        await interaction.deferReply();

        // pobranie utworu i numeru
        const track = interaction.options.getString('utwor');
        const number = interaction.options.getNumber('numer')

        // pobranie kolejki
        const queue = useQueue(interaction.guild);

        // sprawdzenie czy odtwarzam utwór
        if (!queue?.isPlaying()) return interaction.editReply({ content: `Nie odtwarzam aktualnie utworu ${interaction.member}... ❌`, ephemeral: true });
        // sprawdzenie czy podano utwór lub numer
        if (!track && !number) interaction.editReply({ content: `Użyj jednej! z dwóch opcji ${interaction.member}... ❌`, ephemeral: true });

        // sprawdzenie czy podano utwór
        if (track) {
            // sprawdzenie czy utwór istnieje w kolejce
            const track_to_jump = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track)
            // zwrócenie błędu w przypadku braku utworu
            if (!track_to_jump) return interaction.editReply({ content: `Nie odnalazłem utworu "${track}" ${interaction.member}... użyj URL lub pełnej nazwy utworu ❌`, ephemeral: true });
            // przeskoczenie do utworu
            queue.node.jump(track_to_jump);
            // zwrócenie informacji o przeskoczeniu do utworu
            return interaction.editReply({ content: `Przeskoczono do utworu ${track_to_jump.title}  ✅` });
        }
        if (number) {
            // deklaracja numeru utworu oczywiście numerowanie od zera dlatego odjęcie 1 o podanej liczby
            const index = number - 1;
            // sprawdzenie czy utwór istnieje w kolejce
            const trackname = queue.tracks.toArray()[index].title;
            // zwrócenie błędu w przypadku braku utworu
            if (!trackname) return interaction.editReply({ content: `Czy ten utwór istnieje?! ${interaction.member}... ❌`, ephemeral: true });
        // przeskoczenie do utworu
        queue.node.jump(index);

        // stworzenie embeda z informacją o przeskoczeniu do utworu
        const JumpEmbed = new EmbedBuilder()
            .setAuthor({ name: `Przeskoczono do ${trackname} ✅` })
            .setColor('#2f3136')
        
        // edycja wiadomości na kanale z informacją o przeskoczeniu do utworu
        await interaction.editReply({ embeds: [JumpEmbed] });
    }

}
}
