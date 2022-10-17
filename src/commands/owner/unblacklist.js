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
      name: "unblacklist",
      description: "Elimina a un usuario de la lista negra.",
      category: "Owner",
      usage: ["<usuario>"],
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
        `Por favor, proporcione una lista negra de usuario o servidor`
      );
    if (args.length < 2)
      return message.channel.sendCustom(`Proporcióname un usuario`);

    if (!member)
      return message.channel.sendCustom(`Proporcióname un usuario válido`);
    //.then(logger.info(`I have added ${member.user.tag} to the blacklist!`, { label: 'Blacklist' }))

    if (args[0].includes("user")) {
      await Blacklist.findOne(
        {
          discordId: member.id,
        },
        (err, user) => {
          user.deleteOne();
        }
      );
      message.channel.sendCustom({
        embed: {
          color: "BLURPLE",
          title: "¡Usuario eliminado de la lista negra!",
          description: `${member.user.tag} - \`${reason}\``,
        },
      });

      const embed = new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`Informe De Lista Negra`)
        .addField("Estado", "Eliminado de la lista negra.")
        .addField("Usuario", `${member.user.tag} (${member.id})`)
        .addField("Responsable", `${message.author} (${message.author.id})`)
        .addField("Razón", reason);

      webhookClient.sendCustom({
        username: "Roxxy",
        avatarURL: "https://roxxy.es/logo.png",
        embeds: [embed],
      });

      return;
    }

    if (args[0].includes("guild")) {
      await Blacklist.findOne(
        {
          guildId: guild.id,
        },
        (err, server) => {
          server.deleteOne();
        }
      );

      message.channel.sendCustom({
        embed: {
          color: "BLURPLE",
          title: "¡Servidor eliminado de la lista negra!",
          description: `${guild.name} - \`${reason}\``,
        },
      });

      const embed = new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`Informe De Lista Negra`)
        .addField("Estado", "Eliminado de la lista negra")
        .addField("Servidor", `${guild.name} (${guild.id})`)
        .addField("Responsable", `${message.author} (${message.author.id})`)
        .addField("Razón", reason);

      webhookClient.sendCustom({
        username: "Roxxy",
        avatarURL: "https://roxxy.es/logo.png",
        embeds: [embed],
      });
    }
  }
};
