const Event = require("../../structures/Event");
const Logging = require("../../database/schemas/logging");
const discord = require("discord.js");
const Maintenance = require("../../database/schemas/maintenance");
const cooldown = new Set();

module.exports = class extends Event {
  async run(oldChannel, newChannel) {
    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    if (maintenance && maintenance.toggle == "true") return;
    if (cooldown.has(newChannel.guild.id)) return;

    if (
      !oldChannel.name.startsWith("ticket-") ||
      !newChannel.name.startsWith("ticket-")
    ) {
      if (oldChannel.name.indexOf("Room") >= 0) return;
      if (newChannel.name.indexOf("Room") >= 0) return;

      const logging = await Logging.findOne({ guildId: newChannel.guild.id });

      if (logging) {
        if (logging.server_events.toggle == "true") {
          const channelEmbed = await oldChannel.guild.channels.cache.get(
            logging.server_events.channel
          );

          if (channelEmbed) {
            let color = logging.server_events.color;
            if (color == "#000000") color = this.client.color.yellow;

            let type;

            if (newChannel.type === "GUILD_CATEGORY") type = "Categoría";
            if (newChannel.type === "GUILD_TEXT") type = "Canal De Texto";
            if (newChannel.type === "GUILD_VOICE") type = "Canal De Voz";

            if (logging.server_events.channel_created == "true") {
              const embed = new discord.MessageEmbed()
                .setDescription(`:pencil: ***${type} Actualizado***`)
                .addField("Canal", `${newChannel}`, true)
                .setFooter({ text: `ID Del Canal: ${newChannel.id}` })
                .setTimestamp()
                .setColor(color);

              if (oldChannel.name !== newChannel.name) {
                embed.addField(
                  "Actualización De Nombre",
                  `${oldChannel.name} --> ${newChannel.name}`,
                  true
                );
              } else {
                embed.addField("Actualización De Nombre", `Nombre No Actualizado`, true);
              }

              if (oldChannel.topic || newChannel.topic) {
                if (oldChannel.topic !== newChannel.topic) {
                  embed.addField(
                    "Tema",
                    `${oldChannel.topic || "Ninguno"} --> ${
                      newChannel.topic || "Ninguno"
                    }`
                  );
                }
              }

              if (oldChannel.nsfw || newChannel.nsfw) {
                if (oldChannel.nsfw !== newChannel.nsfw) {
                  embed.addField(
                    "NSFW",
                    `${oldChannel.nsfw} --> ${newChannel.nsfw}`
                  );
                }
              }

              if (oldChannel.rateLimitPerUser || newChannel.rateLimitPerUser) {
                if (
                  oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser
                ) {
                  embed.addField(
                    "Slowmode",
                    `${oldChannel.rateLimitPerUser} --> ${newChannel.rateLimitPerUser}`
                  );
                }
              }

              if (oldChannel.rateLimitPerUser === newChannel.rateLimitPerUser) {
                if (oldChannel.name === newChannel.name) {
                  if (oldChannel.topic === newChannel.topic) {
                    if (oldChannel.nsfw === newChannel.nsfw) {
                      return;
                    }
                  }
                }
              }

              if (
                channelEmbed &&
                channelEmbed.viewable &&
                channelEmbed
                  .permissionsFor(newChannel.guild.me)
                  .has(["SEND_MESSAGES", "EMBED_LINKS"])
              ) {
                channelEmbed.send({ embeds: [embed] }).catch(() => {});
                cooldown.add(newChannel.guild.id);
                setTimeout(() => {
                  cooldown.delete(newChannel.guild.id);
                }, 3000);
              }
            }
          }
        }
      }
    }
  }
};
