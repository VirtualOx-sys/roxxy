const Event = require("../../structures/Event");
const Logging = require("../../database/schemas/logging");
const discord = require("discord.js");
const Maintenance = require("../../database/schemas/maintenance");

function makehex(rgb) {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}

module.exports = class extends Event {
  async run(oldRole, newRole) {
    if (!newRole) return;
    if (newRole.managed) return;
    const logging = await Logging.findOne({ guildId: oldRole.guild.id });

    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    if (maintenance && maintenance.toggle == "true") return;

    if (logging) {
      if (logging.server_events.toggle == "true") {
        const channelEmbed = await newRole.guild.channels.cache.get(
          logging.server_events.channel
        );

        if (channelEmbed) {
          let color = logging.server_events.color;
          if (color == "#000000") color = newRole.client.color.green;

          if (logging.server_events.role_update == "true") {
            const embed = new discord.MessageEmbed()
              .setDescription(`:pencil: ***Rol Actualizado***`)

              .setFooter({ text: `ID Del Rol: ${newRole.id}` })
              .setTimestamp()
              .setColor(color);

            if (oldRole.name !== newRole.name) {
              embed.addField(
                "Actualización De Nombre",
                `${oldRole.name} --> ${newRole.name}`,
                true
              );
            } else {
              embed.addField("Actualización De Nombre", `Nombre No Actualizado`, true);
            }

            if (oldRole.color !== newRole.color) {
              embed.addField(
                "Color Actualizado",
                `#${makehex(oldRole.color)} --> #${makehex(newRole.color)}`,
                true
              );
            }

            if (oldRole.mentionable !== newRole.mentionable) {
              embed.addField(
                "Mencionable",
                `${oldRole.mentionable} --> ${newRole.mentionable}`,
                true
              );
            }

            if (
              channelEmbed &&
              channelEmbed.viewable &&
              channelEmbed
                .permissionsFor(newRole.guild.me)
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
