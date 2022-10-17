const Event = require("../../structures/Event");
const Logging = require("../../database/schemas/logging");
const discord = require("discord.js");
const Maintenance = require("../../database/schemas/maintenance");

module.exports = class extends Event {
  async run(role) {
    if (!role) return;
    if (role.managed) return;
    const logging = await Logging.findOne({ guildId: role.guild.id });

    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    if (maintenance && maintenance.toggle == "true") return;

    if (logging) {
      if (logging.server_events.toggle == "true") {
        const channelEmbed = await role.guild.channels.cache.get(
          logging.server_events.channel
        );

        if (channelEmbed) {
          let color = logging.server_events.color;
          if (color == "#000000") color = role.client.color.red;

          if (logging.server_events.role_create == "true") {
            const embed = new discord.MessageEmbed()
              .setDescription(`🗑️ ***Rol Eliminado***`)
              .addField("Nombre Del Rol", `${role.name}`, true)
              .setFooter({ text: `ID Del Rol: ${role.id}` })
              .setTimestamp()
              .setColor(color);

            if (
              channelEmbed &&
              channelEmbed.viewable &&
              channelEmbed
                .permissionsFor(role.guild.me)
                .has(["SEND_MESSAGES", "EMBED_LINKS"])
            ) {
              channelEmbed.send({embeds: [embed]}).catch(() => {});
            }
          }
        }
      }
    }
  }
};
