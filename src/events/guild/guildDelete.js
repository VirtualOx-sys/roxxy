const Event = require("../../structures/Event");
const Discord = require("discord.js");
const logger = require("../../utils/logger");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");
const config = require("../../../config.json");
const welcomeClient = new Discord.WebhookClient({
  url: config.webhooks.leavesPublic,
});
const webhookClient = new Discord.WebhookClient({
  url: config.webhooks.leavesPrivate,
});
module.exports = class extends Event {
  async run(guild) {
    if (guild.name === undefined) return;
    Guild.findOneAndDelete(
      {
        guildId: guild.id,
      },
      (err) => {
        if (err) console.log(err);
        logger.info(`He abandonado "${guild.name}" (${guild.id})`, {
          label: "Servidores",
        });
      }
    );

    const welcomeEmbed = new Discord.MessageEmbed()
      .setColor(`RED`)
      .setTitle("Salir Del Servidor")
      .setThumbnail(`https://roxxy.es/logo`)
      .setDescription(`¡Roxxy dejó un servidor!`)
      .addField(`Nombre Del Servidor`, `\`${guild.name}\``, true)
      .addField(`ID Del Servidor`, `\`${guild.id}\``, true)
      .setFooter({
        text: `${this.client.guilds.cache.size} servidores `,
        iconURL: "https://roxxy.es/logo.png",
      });

    welcomeClient.sendCustom({
      username: "Roxxy",
      avatarURL: "https://roxxy.es/logo.png",
      embeds: [welcomeEmbed],
    });

    Logging.findOneAndDelete({
      guildId: guild.id,
    }).catch(() => {});

    const embed = new Discord.MessageEmbed()
      .setColor("RED")
      .setDescription(`He dejado el servidor ${guild.name}.`)
      .setFooter({
        text: `Perdí ${guild.members.cache.size - 1} miembros • Ahora estoy en ${
          this.client.guilds.cache.size
        } servidores...\n\nID: ${guild.id}`,
      })
      .setThumbnail(
        guild.iconURL({ dynamic: true })
          ? guild.iconURL({ dynamic: true })
          : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(
              guild.name
            )}`
      )
      .addField("Propietario Del Servidor", `${guild.owner} / ${guild.ownerID}`);

    webhookClient.sendCustom({
      username: "Roxxy",
      avatarURL: "https://roxxy.es/logo.png",
      embeds: [embed],
    });
  }
};
