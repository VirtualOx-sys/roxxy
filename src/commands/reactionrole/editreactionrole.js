const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const ReactionRole = require("../../packages/reactionrole/index.js");
const react = new ReactionRole();

require("dotenv").config();
react.setURL(process.env.MONGO);

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "editreaction",
      aliases: ["editreactionrole", "err"],
      description: "Edita el rol que da por una determinada reacción.",
      category: "Rol Por Reaccion",
      cooldown: 3,
      usage: "<channel> <messageID> <newRoleID> <emoji>",
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    let client = message.client;
    let fail = message.client.emoji.fail;

    let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]) ||
      message.guild.channels.cache.find((ch) => ch.name === args[0]);
    if (!channel)
      return message.channel
        .sendCustom({
          embeds: [
            new MessageEmbed()
              .setAuthor(message.author.tag, message.author.displayAvatarURL())
              .setDescription(`${fail} Proporcióname un canal válido`)
              .setFooter({ text: "https://roxxy.es" }),
          ],
        })
        .setColor(client.color.red);

    let ID = args[1];
    if (!ID)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`${fail} Proporcióname un ID de mensaje válido`)
            .setFooter({ text: "https://roxxy.es" }),
        ],
      });
    let messageID = await channel.messages.fetch(ID).catch(() => {
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`${fail} No pude encontrar la siguiente ID`)
            .setFooter({ text: "https://roxxy.es" })
            .setColor(client.color.red),
        ],
      });
    });
    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find((rl) => rl.name === args[2]);
    if (!role)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`${fail} Proporcióname un Rol válido`)
            .setFooter({ text: "https://roxxy.es" })
            .setColor(client.color.red),
        ],
      });

    if (role.managed) {
      return message.channel.sendCustom(
        `${message.client.emoji.fail} No utilice un rol de integración.`
      );
    }

    let emoji = message.guild.emojis.cache.find(
      (emoji) => emoji.name.toLowerCase() === args[3].toLowerCase()
    );

    await react.reactionEdit(client, message.guild.id, ID, role.id, emoji);

    message.channel.sendCustom({
      embeds: [
        new MessageEmbed()
          .setAuthor(
            "Editar Roles Por Reacción",
            message.guild.iconURL(),
            messageID.url
          )
          .setColor(client.color.green)
          .addField("Canal", `${channel}`, true)
          .addField("Emoji", `${emoji}`, true)
          .addField("ID Del Mensaje", `${IDBCursor}`, true)
          .addField("Mensaje", `[Saltar Al Mensaje](${messageID.url})`, true)
          .addField("Rol", `${role}`, true)
          .setFooter({ text: "https://roxxy.es" }),
      ],
    });
  }
};
