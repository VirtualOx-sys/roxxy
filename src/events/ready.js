const logger = require("../utils/logger");
const Event = require("../structures/Event");
const Discord = require("discord.js");
const config = require("../../config.json");
const Guild = require("../database/schemas/Guild");
const { WebhookClient } = require("discord.js");
const premiumrip = new WebhookClient({ url: config.webhooks.premium });
const Message = require("../utils/other/message");
const { Handler } = require("discord-slash-command-handler");
module.exports = class extends Event {
  async run() {
    Message(this.client);

    new Handler(this.client, {
      commandFolder: "./src/slash",
      commandType: "file",
      allSlash: true,
      handleSlash: true,
    });

    logger.info(
      `${this.client.user.tag} está listo para servir a ${this.client.guilds.cache.size} servidores.`,
      { label: "Listo" }
    );

    setInterval(async () => {
      const conditional = {
        isPremium: "true",
      };
      const results = await Guild.find(conditional);

      if (results && results.length) {
        for (const result of results) {
          if (
            Number(result.premium.redeemedAt) >=
            Number(result.premium.expiresAt)
          ) {
            const guildPremium = this.client.guilds.cache.get(result.guildId);
            if (guildPremium) {
              const user = await this.client.users.cache.get(
                result.premium.redeemedBy.id
              );

              if (user) {
                const embed = new Discord.MessageEmbed()
                  .setColor(this.client.color.red)
                  .setDescription(
                    `Hola ${user.username}, el Premium en ${guildPremium.name} acaba de expirar :(\n\n__¡Puedes renovar tu servidor aquí! [https://roxxy.es/premium](https://roxxy.es/premium)__\n\n¡Gracias por comprar Premium anteriormente! Esperamos que hayas disfrutado lo que compraste.\n\n**- Roxxy**`
                  );

                user.send({ embeds: [embed] }).catch(() => {});
              }

              const rip = new Discord.MessageEmbed()
                .setDescription(
                  `**Suscripción Premium**\n\n**Servidor:** ${
                    guildPremium.name
                  } | **${guildPremium.id}**\nRedimido por: ${
                    user.tag || "Desconocido"
                  }\n**Plan:** ${result.premium.plan}`
                )
                .setColor("RED")
                .setTimestamp();

              await premiumrip
                .sendCustom({
                  username: "Roxxy Perdio Premium",
                  avatarURL: `${this.client.domain}/logo.png`,
                  embeds: [rip],
                })
                .catch(() => {});

              result.isPremium = "false";
              result.premium.redeemedBy.id = null;
              result.premium.redeemedBy.tag = null;
              result.premium.redeemedAt = null;
              result.premium.expiresAt = null;
              result.premium.plan = null;

              await result.save().catch(() => {});
            }
          }
        }
      }
    }, 86400000);

    if (config.dashboard === "true") {
      const Dashboard = require("../dashboard/dashboard");
      Dashboard(this.client);
    }
  }
};
