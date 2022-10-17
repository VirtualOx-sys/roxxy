const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const discord = require("discord.js");
const crypto = require("crypto");
const config = require("../../../config.json");
const webhookClient = new discord.WebhookClient({
  url: config.webhooks.suggestions,
});
const Guild = require("../../database/schemas/Guild");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "suggestbot",
      aliases: ["botsuggest"],
      description: `¡Sugiere una nueva función para Roxxy!`,
      category: "Utilidad",
      examples: ["suggest ¿Puedes agregar música por favor?"],
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
            .setDescription(
              `${message.client.emoji.fail} ${language.suggest1}`
            ),
        ],
      });
    }

    if (args.length < 3) {
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setColor(message.client.color.blue)
            .setDescription(
              `${message.client.emoji.fail} ${language.suggest2}`
            ),
        ],
      });
    }

    //args.join(' ').split('').join('')
    let invite = await message.channel
      .createInvite({
        maxAge: 0,
        maxUses: 0,
      })
      .catch(() => {});

    let report = args.join(" ").split("").join("");
    const embed = new MessageEmbed()
      .setTitle("Nueva Sugerencia")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(report)
      .addField("Usuario", `${message.member}`, true)
      .addField("Nombre De Usuario Del Usuario", `${message.member.user.username}`, true)
      .addField("ID Del Usuario", `${message.member.id}`, true)
      .addField("Tag Del Usuario", `${message.member.user.tag}`, true)
      .addField("Servidor", `[${message.guild.name}](${invite || "Ninguno "})`, true)
      .addField("ID De Comentarios:", `#${id}`, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor("GREEN");

    const confirmation = new MessageEmbed()
      .setTitle("Sugerencias De La Bot")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `${language.suggest3} Soporte [**Servidor**](${config.discord})`
      )
      .addField("Miembro", `${message.member}`, true)
      .addField("Mensaje", `${report}`, true)
      .addField("ID De Sugerencia:", `#${id}`, true)
      .setFooter({ text: "https://roxxy.es" })
      .setTimestamp()
      .setColor("GREEN");

    webhookClient.sendCustom({
      username: "Sugerencias De Roxxy",
      avatarURL: `https://roxxy.es/logo.png`,
      embeds: [embed],
    });

    message.delete().catch(() => {});
    message.author.send({ embeds: [confirmation] }).catch(() => {});
  }
};
