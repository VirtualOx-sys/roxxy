const discord = require("discord.js");
const Command = require("../../structures/Command");
const ReactionMenu = require("../../data/ReactionMenu.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "youngest",
      aliases: ["young"],
      usage: "<fecha>",
      category: "Detector Alt",
      examples: ["youngest 30"],
      description: "Encuentre todas las alts más jóvenes con la fecha de unión provista (días)",
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
              `${message.client.emoji.fail} | Solo puede encontrar alts de una edad de cuenta de **100 días** o menos`
            ),
        ],
      });

    let array = [];

    message.guild.members.cache.forEach(async (user) => {
      let x = Date.now() - user.joinedAt;
      let created = Math.floor(x / 86400000);

      if (day > created) {
        array.push(
          `${user} (${user.user.tag} | ${user.id})\nSe Unió El: **${user.joinedAt}**`
        );
      }
    });

    const interval = 10;

    const embed = new discord.MessageEmbed()
      .setTitle(`Detector Alt - Edad de ingreso < ${days} Días`)
      .setDescription(array.join("\n\n") || "No alts found")
      .setColor(message.client.color.green);

    if (array.length <= interval) {
      message.channel.sendCustom(
        embed
          .setTitle(`Detector Alt - Edad de ingreso < ${days} Días`)
          .setDescription(array.join("\n\n"))
      );
    } else {
      embed.setTitle(`Detector Alt - Edad de ingreso < ${days} Días`).setFooter({
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
