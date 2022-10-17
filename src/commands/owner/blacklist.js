const Command = require("../../structures/Command");
const { WebhookClient, MessageEmbed } = require("discord.js");
const config = require("../../../config.json");
const webhookClient = new WebhookClient({
  url: config.webhooks.blacklist,
});
const Blacklist = require("../../database/schemas/blacklist");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "blacklist",
      aliases: ["bl"],
      description: "Agrega un usuario a la lista negra.",
      category: "Owner",
      usage: ["<usuario> <razón>"],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const match = message.content.match(/\d{18}/);
    let member;
    try {
      member = match
        ? message.mentions.members.first() ||
          message.guild.members.fetch(args[1])
        : null;
    } catch {
      return message.channel.sendCustom(`Proporcióname un usuario`);
    }

    let guild = this.client.guilds.cache.get(args[1]);
    let reason = args.slice(2).join(" ") || "No Especificado";

    if (args.length < 1)
      return message.channel.sendCustom(
        `Por favor, proporcione un usuario o servidor para la blacklist [{prefix} blacklist <user | guild> <usuario actual o servidor>. Ejemplo: {prefix} blacklist user @usuario]`
      );
    if (args.length < 2)
      return message.channel.sendCustom(`Proporcióname un usuario`);

    if (!member)
      return message.channel.sendCustom(`Provide me with a valid user`);

    if (args[0] === "user") {
      await Blacklist.findOne(
        {
          discordId: member.id,
        },
        (err, user) => {
          if (!user) {
            const blacklist = new Blacklist({
              discordId: member.id,
              length: null,
              type: "user",
              isBlacklisted: true,
              reason,
            });
            blacklist.save();
          } else {
            user.updateOne({
              type: "user",
              isBlacklisted: true,
              reason,
              length: null,
            });
          }
        }
      );

      message.channel.sendCustom({
        embed: {
          color: "BLURPLE",
          title: `¡Usuario agregado a la lista negra! `,
          description: `${member.user.tag} - \`${reason}\``,
        },
      });

      const embed = new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`Informe De Lista Negra`)
        .addField("Estado", "Añadido a la lista negra.")
        .addField("Usuario", `${member.user.tag} (${member.id})`)
        .addField("Responsable", `${message.author} (${message.author.id})`)
        .addField("Razón", `${reason}`);

      return webhookClient.sendCustom({
        username: "Roxxy",
        avatarURL: `https://roxxy.es/logo.png`,
        embeds: [embed],
      });
    }

    // guild blacklist
    if (args[0] === "guild") {
      await Blacklist.findOne(
        {
          guildId: guild,
        },
        (err, server) => {
          if (!server) {
            const blacklist = new Blacklist({
              guildId: guild.id,
              length: null,
              type: "guild",
              isBlacklisted: true,
              reason,
            });
            blacklist.save();
          } else {
            server.updateOne({
              type: "guild",
              isBlacklisted: true,
              reason,
              length: null,
            });
          }
        }
      );

      message.channel.sendCustom({
        embed: {
          color: "BLURPLE",
          title: "¡Servidor agregado a la lista negra!",
          description: `${guild.name} - \`${reason}\``,
        },
      });

      const embed = new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`Informe De Lista Negra`)
        .addField("Estado", "Añadido a la lista negra.")
        .addField("Servidor", `${guild.name} (${guild.id})`)
        .addField("Responsable", `${message.author} (${message.author.id})`)
        .addField("Razón", reason);

      return webhookClient.sendCustom({
        username: "Roxxy Blacklists",
        avatarURL: `https://roxxy.es/logo.png`,
        embeds: [embed],
      });
    }
  }
};
