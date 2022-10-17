const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale('es');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "server",
      aliases: [],
      description: "Revisa el servidor",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    function checkDays(date) {
      let now = new Date();
      let diff = now.getTime() - date.getTime();
      let days = Math.floor(diff / 86400000);
      return days + (days == 1 ? " día" : " días") + " atrás";
    }

    const guildId = args[0];
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.sendCustom(`ID de servidor no válido`);

    const embed = new MessageEmbed()
      .setAuthor(guild.name, guild.iconURL())
      .addField("ID Del Servidor", `${guild.id}`, true)
      .addField(
        "Total | Humanos | Bots",
        `${guild.members.cache.size} | ${
          guild.members.cache.filter((member) => !member.user.bot).size
        } | ${guild.members.cache.filter((member) => member.user.bot).size}`,
        true
      )
      .addField("Nivel De Verificación", `${guild.verificationLevel}`, true)
      .addField("Canales", `${guild.channels.cache.size}`, true)
      .addField("Roles", `${guild.roles.cache.size}`, true)
      .addField(
        "Fecha De Creación",
        `${guild.createdAt.toUTCString().substr(0, 16)} (${checkDays(
          guild.createdAt
        )})`,
        true
      )
      .setThumbnail(guild.iconURL())
      .setColor(message.guild.me.displayHexColor);
    message.channel.sendCustom({ embed }).catch((error) => {
      message.channel.sendCustom(`Error: ${error}`);
    });
  }
};
