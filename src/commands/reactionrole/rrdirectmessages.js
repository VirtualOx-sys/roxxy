const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");
const ReactionRole = require("../../packages/reactionrole/index.js");
const react = new ReactionRole();

require("dotenv").config();
react.setURL(process.env.MONGO);

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "rrdm",
      aliases: ["reactionrolesdm", "rrdirectmessages"],
      description: "Habilitar / deshabilitar DM del rol por reacción",
      category: "Rol Por Reaccion",
      cooldown: 3,
      usage: "on / off",
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    let client = message.client;

    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    let fail = message.client.emoji.fail;
    let success = message.client.emoji.success;
    const prefix = guildDB.prefix;

    if (guildDB.isPremium == "false") {
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setDescription(
              `${fail} Reduzca la velocidad aquí, el comando actual es solo para servidores premium.\n\n[Consulta el premium aquí](https://roxxy.es/premium)`
            ),
        ],
      });
    }

    let properUsage = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setDescription(
        `__**Uso Adecuado**__\n\n\`1-\` ${prefix}rrdm on\n\`2-\` ${prefix}rrdm off`
      )
      .setFooter({ text: "https://roxxy.es" });

    if (args.length < 1) {
      return message.channel.sendCustom(properUsage);
    }

    if (args.includes("disable") || args.includes("off")) {
      await Guild.findOne(
        {
          guildId: message.guild.id,
        },
        async (err, guild) => {
          if (guild.reactionDM === false)
            return message.channel
              .sendCustom({
                embeds: [
                  new MessageEmbed()
                    .setAuthor(
                      message.author.tag,
                      message.author.displayAvatarURL()
                    )
                    .setDescription(`${fail} Los DM ya están deshabilitados`)
                    .setFooter({ text: "https://roxxy.es" }),
                ],
              })
              .setColor(client.color.red);

          guild
            .updateOne({
              reactionDM: false,
            })
            .catch((err) => console.error(err));
        }
      );
      message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`${success} ¡Los DM del rol por reacción han sido deshabilitados!`)
            .setFooter({ text: "https://roxxy.es" })
            .setColor(client.color.red),
        ],
      });
    } else if (args.includes("enable") || args.includes("on")) {
      await Guild.findOne(
        {
          guildId: message.guild.id,
        },
        async (err, guild) => {
          if (guild.reactionDM === true)
            return message.channel.sendCustom({
              embeds: [
                new MessageEmbed()
                  .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL()
                  )
                  .setDescription(`${fail} Los DM ya están habilitados`)
                  .setFooter({ text: "https://roxxy.es" })
                  .setColor(client.color.red),
              ],
            });
          guild
            .updateOne({
              reactionDM: true,
            })
            .catch((err) => console.error(err));

          message.channel.sendCustom({
            embeds: [
              new MessageEmbed()
                .setAuthor(
                  message.author.tag,
                  message.author.displayAvatarURL()
                )
                .setDescription(
                  `${success} ¡Se han habilitado los DM del rol por reacción!`
                )
                .setFooter({ text: "https://roxxy.es" })
                .setColor(client.color.red),
            ],
          });
        }
      );
    } else if (args[0]) {
      message.channel.sendCustom(properUsage);
    } else {
      message.channel.sendCustom(properUsage);
    }
  }
};
