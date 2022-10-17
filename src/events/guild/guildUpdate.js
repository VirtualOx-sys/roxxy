const Event = require("../../structures/Event");
const Logging = require("../../database/schemas/logging");
const discord = require("discord.js");
const Maintenance = require("../../database/schemas/maintenance");
module.exports = class extends Event {
  async run(oldGuild, newGuild) {
    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    if (maintenance && maintenance.toggle == "true") return;

    const logging = await Logging.findOne({ guildId: oldGuild.id });

    if (logging) {
      if (logging.server_events.toggle == "true") {
        const channelEmbed = await oldGuild.channels.cache.get(
          logging.server_events.channel
        );

        if (channelEmbed) {
          let color = logging.server_events.color;
          if (color == "#000000") color = oldGuild.client.color.yellow;

          if (logging.server_events.channel_created == "true") {
            const embed = new discord.MessageEmbed()
              .setDescription(`:pencil: ***Servidor Actualizado***`)
              .setFooter({ text: `ID Del Servidor: ${oldGuild.id}` })
              .setTimestamp()
              .setColor(color);

            if (oldGuild.name !== newGuild.name) {
              embed.addField(
                "Actualización De Nombre",
                `${oldGuild.name} --> ${newGuild.name}`,
                true
              );
            } else {
              embed.addField("Actualización De Nombre", `Nombre No Actualizado`, true);
            }

            if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
              embed.addField(
                "Nivel De Verificación",
                `${oldGuild.verificationLevel || "Ninguno"} --> ${
                  newGuild.verificationLevel || "Ninguno"
                }`,
                true
              );
            }

            if (oldGuild.icon !== newGuild.icon) {
              embed.addField(
                "Icono",
                `[Icono Antiguo](${oldGuild.iconURL({
                  dynamic: true,
                  size: 512,
                })}) --> [Icono Nuevo](${newGuild.iconURL({
                  dynamic: true,
                  size: 512,
                })})`,
                true
              );
            }

            if (oldGuild.region !== newGuild.region) {
              embed.addField(
                "Región",
                `${oldGuild.region || "Ninguna"} --> ${newGuild.region || "Ninguna"}`,
                true
              );
            }

            if (oldGuild.ownerID !== newGuild.ownerID) {
              embed.addField(
                "Dueño",
                `<@${oldGuild.ownerID || "Ninguno"}> **(${
                  oldGuild.ownerID
                })** --> <@${newGuild.ownerID}>**(${newGuild.ownerID})**`,
                true
              );
            }

            if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
              embed.addField(
                "Tiempo De Espera Para AFK",
                `${oldGuild.afkTimeout || "Ninguno"} --> ${
                  newGuild.afkTimeout || "Ninguno"
                }`,
                true
              );
            }

            if (oldGuild.afkChannelID !== newGuild.afkChannelID) {
              embed.addField(
                "Canal AFK",
                `${oldGuild.afkChannelID || "Ninguno"}> --> ${
                  newGuild.afkChannelID || "Ninguno"
                }`,
                true
              );
            }

            if (
              channelEmbed &&
              channelEmbed.viewable &&
              channelEmbed
                .permissionsFor(newGuild.me)
                .has(["SEND_MESSAGES", "EMBED_LINKS"])
            ) {
              channelEmbed.send({ embeds: [embed] }).catch(() => {});
            }
          }
        }
      }
    }
  }
};
