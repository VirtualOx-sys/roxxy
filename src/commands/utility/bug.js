const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const config = require("../../../config.json");
const webhookClient = new Discord.WebhookClient({ url: config.webhooks.bugs });
const Guild = require("../../database/schemas/Guild");
const crypto = require("crypto");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "reportbug",
      aliases: ["bugreport", "bug"],
      description: "¡Informe de errores a Roxxy!",
      category: "Utilidad",
      usage: ["<texto>"],
      cooldown: 60,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    var id = crypto.randomBytes(4).toString("hex");

    if (args.length < 1) {
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setColor(message.client.color.blue)
            .setDescription(`${message.client.emoji.fail} ${language.report1}`),
        ],
      });
    }

    if (args.length < 3) {
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setColor(message.client.color.blue)
            .setDescription(`${message.client.emoji.fail} ${language.report2}`),
        ],
      });
    }

    let invite = await message.channel
      .createInvite({
        maxAge: 0,
        maxUses: 0,
      })
      .catch(() => {});

    let report = args.join(" ").split("").join("");
    const embed = new MessageEmbed()
      .setTitle("Informe De Error")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(report)
      .addField("Usuario", `${message.member}`, true)
      .addField("Nombre De Usuario Del Usuario", `${message.member.user.username}`, true)
      .addField("ID Del Usuario", `${message.member.id}`, true)
      .addField("Tag Del Usuario", `${message.member.user.tag}`, true)
      .addField("Servidor", `[${message.guild.name}](${invite || "none "})`, true)
      .addField("ID De Informe De Error:", `#${id}`, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor("GREEN");

    const confirmation = new MessageEmbed()
      .setTitle("Informe De Error")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `${language.report3} Soporte [**Servidor**](${config.discord})`
      )
      .addField("Miembro", `${message.member}`, true)
      .addField("Mensaje", `${report}`, true)
      .addField("ID De Informe De Error::", `#${id}`, true)
      .setFooter({ text: "https://roxxy.es" })
      .setTimestamp()
      .setColor("GREEN");

    webhookClient.sendCustom({
      username: "Informe De Errores De Roxxy",
      avatarURL: `https://roxxy.es/logo.png`,
      embeds: [embed],
    });

    message.author.send({ embeds: [confirmation] }).catch(() => {});
    message.delete().catch(() => {});
  }
};
