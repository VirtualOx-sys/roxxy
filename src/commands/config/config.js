const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "settings",
      aliases: ["cfg"],
      description: "Muestra la configuración actual de este servidor.",
      category: "Config",
      guildOnly: true,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);
    await message.channel.sendCustom({
      embeds: [
        new MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .setTitle(`${language.serversettings1}`)
          .addField(
            `Ajustes Principales`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id})`,
            true
          )
          .addField(
            `Bienvenidas & Despedidas`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id}/welcome)`,
            true
          )
          .addField(
            `Registro`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id}/logging)`,
            true
          )
          .addField(
            `Autoroles`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id}/autorole)`,
            true
          )
          .addField(
            `Detector Alt`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id}/altdetector)`,
            true
          )
          .addField(
            `Tickets`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id}/tickets)`,
            true
          )
          .addField(
            `Sugerencias`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id}/Suggestions)`,
            true
          )
          .addField(
            `Informes Del Servidor`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id}/reports)`,
            true
          )
          .addField(
            `Automod`,
            `[\`Haga Clic Aquí\`](https://roxxy.es/dashboard/${message.guild.id}/automod)`,
            true
          )

          .setFooter({ text: `${message.guild.name}` }),
      ],
    });
  }
};
