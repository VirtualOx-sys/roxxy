const discord = require("discord.js");
const Command = require("../../structures/Command");
const ReactionMenu = require("../../data/ReactionMenu.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "findalts",
      aliases: ["identifyalt", "findalt", "identifyalts"],
      usage: "<fecha>",
      category: "Detector Alt",
      examples: ["identifyalts 30"],
      description:
        "Encuentre todas las cuentas alternativas en el servidor con la edad proporcionada (días)",
      cooldown: 10,
      userPermission: ["MANAGE_GUILD"],
    });
  }
  async run(message, args) {
    const client = message.client;

    let days = args[0];
    if (!days)
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.red)
            .setDescription(
              `${message.client.emoji.fail} | Proporcione una duración de días válida`
            ),
        ],
      });

    if (isNaN(days))
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.red)
            .setDescription(
              `${message.client.emoji.fail} | Proporcione una duración de días válida`
            ),
        ],
      });

    let day = Number(days);

    if (day > 100)
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.red)
            .setDescription(
              `${message.client.emoji.fail} | Solo puede encontrar alts de una edad de **100 días** o menos`
            ),
        ],
      });

    let array = [];

    message.guild.members.cache.forEach(async (user) => {
      let x = Date.now() - user.user.createdAt;
      let created = Math.floor(x / 86400000);

      if (day > created) {
        array.push(
          `${user} (${user.user.tag} | ${user.id})\nCreado En: **${user.user.createdAt}**`
        );
      }
    });

    const interval = 10;

    const embed = new discord.MessageEmbed()
      .setTitle(`Detector Alt - Antigüedad de la cuenta < ${days} Días`)
      .setDescription(array.join("\n\n") || "No Se Encontraron Alts")
      .setColor(message.client.color.green);

    if (array.length <= interval) {
      message.channel.sendCustom(
        embed
          .setTitle(`Detector Alt - Antigüedad de la cuenta < ${days} Días`)
          .setDescription(array.join("\n\n"))
      );
    } else {
      embed.setTitle(`Detector Alt - Antigüedad de la cuenta < ${days} Días`).setFooter({
        text: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      new ReactionMenu(
        message.client,
        message.channel,
        message.member,
        embed,
        array,
        interval
      );
    }
  }
};
