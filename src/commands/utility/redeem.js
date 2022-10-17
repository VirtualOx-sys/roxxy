const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const Premium = require("../../database/schemas/GuildPremium");
const moment = require("moment");
moment.locale('es');
const config = require("../../../config.json");
const discord = require("discord.js");
const webhookClient = new discord.WebhookClient({
  url: config.webhooks.premium,
});
let uniqid = require("uniqid");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "redeem",
      description: `¡Canjea un código Premium!`,
      category: "Utilidad",
      cooldown: 3,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    let code = args[0];

    if (!code)
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor("RED")
            .setDescription(
              `${message.client.emoji.fail} Especifique un código para canjear`
            ),
        ],
      });

    if (guildDB.isPremium === "true") {
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor("RED")
            .setDescription(
              `${message.client.emoji.fail} el gremio actual ya es premium`
            ),
        ],
      });
    }

    const premium = await Premium.findOne({
      code: code,
    });

    if (premium) {
      const expires = moment(Number(premium.expiresAt)).format(
        "dddd, MMMM Do YYYY HH:mm:ss"
      );

      guildDB.isPremium = "true";
      guildDB.premium.redeemedBy.id = message.author.id;
      guildDB.premium.redeemedBy.tag = message.author.tag;
      guildDB.premium.redeemedAt = Date.now();
      guildDB.premium.expiresAt = premium.expiresAt;
      guildDB.premium.plan = premium.plan;

      await guildDB.save().catch(() => {});

      await premium.deleteOne().catch(() => {});

      let ID = uniqid(undefined, `-${code}`);
      const date = require("date-and-time");
      const now = new Date();
      let DDate = date.format(now, "YYYY/MM/DD HH:mm:ss");

      try {
        await message.author.send({
          embeds: [
            new discord.MessageEmbed()
              .setDescription(
                `**Suscripción Premium**\n\nHa canjeado recientemente un código en **${message.guild.name}** y aquí está su recibo:\n\n **ID De Recibo:** ${ID}\n**Fecha De Canje:** ${DDate}\n**Nombre Del Servidor:** ${message.guild.name}\n**ID Del Servidor:** ${message.guild.id}`
              )
              .setColor(message.guild.me.displayHexColor)
              .setFooter({ text: message.guild.name }),
          ],
        });
      } catch (err) {
        console.log(err);
        message.channel.sendCustom({
          embeds: [
            new discord.MessageEmbed()
              .setDescription(
                `**¡Felicidades!**\n\n**${message.guild.name}** ¡Ahora es un servidor premium! ¡Muchas gracias!\n\nSi tiene alguna pregunta, comuníquese conmigo [aquí](${config.discord})\n\n**No se pudo enviar su recibo a través del dm, así que aquí está: **\n** ID De Recibo:** ${ID}\n**Fecha De Canje:** ${DDate}\n**Nombre Del Servidor:** ${message.guild.name}\n**ID Del Servidor:** ${message.guild.id}\n\n**Asegúrese de mantener esta información segura, es posible que la necesite si alguna vez desea reembolsar o transferir servidores.**\n\n**Caduca En:** ${expires}`
              )
              .setColor(message.guild.me.displayHexColor)
              .setFooter({ text: message.guild.name }),
          ],
        });

        return;
      }

      message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setDescription(
              `**¡Felicidades!**\n\n**${message.guild.name}** ¡Ahora es un servidor premium! ¡Muchas gracias!\n\nSi tiene alguna pregunta, comuníquese conmigo [aquí](${config.discord})\n**su recibo ha sido enviado a través del dm**\n\n**Caduca En:** ${expires}`
            )
            .setColor(message.guild.me.displayHexColor)
            .setFooter({ text: message.guild.name }),
        ],
      });

      const embedPremium = new discord.MessageEmbed()
        .setDescription(
          `**Suscripción Premium**\n\n**${message.author.tag}** Canjeó Un Código En **${message.guild.name}**\n\n **ID De Recibo:** ${ID}\n**Fecha De Canje:** ${DDate}\n**Nombre Del Servidor:** ${message.guild.name}\n**ID Del Servidor:** ${message.guild.id}\n**Etiqueta Del Usuario:** ${message.author.tag}\n**ID Del Usuario:** ${message.author.id}\n\n**Caduca A Las:** ${expires}`
        )
        .setColor(message.guild.me.displayHexColor);

      webhookClient.sendCustom({
        username: "Roxxy Premium",
        avatarURL: `https://roxxy.es/logo.png`,
        embeds: [embedPremium],
      });
    } else {
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor("RED")
            .setDescription(
              `${message.client.emoji.fail} No pude seguir el código.`
            ),
        ],
      });
    }
  }
};
