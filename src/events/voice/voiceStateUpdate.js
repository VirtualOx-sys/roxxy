const Event = require("../../structures/Event");
const Logging = require("../../database/schemas/logging");
const discord = require("discord.js");
const Maintenance = require("../../database/schemas/maintenance");
const cooldown = new Set();

module.exports = class extends Event {
  async run(oldState, newState) {
    if (!oldState || !newState) return;

    const logging = await Logging.findOne({ guildId: oldState.guild.id });

    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    if (maintenance && maintenance.toggle == "true") return;

    if (cooldown.has(newState.guild.id)) return;

    if (logging) {
      if (logging.server_events.toggle == "true") {
        const channelEmbed = await oldState.guild.channels.cache.get(
          logging.server_events.channel
        );

        if (channelEmbed) {
          let colorGreen = logging.server_events.color;
          if (colorGreen === "#000000") colorGreen = "GREEN";

          let colorRed = logging.server_events.color;
          if (colorRed === "#000000") colorRed = "RED";

          let colorYellow = logging.server_events.color;
          if (colorYellow === "#000000") colorYellow = "YELLOW";

          let oldChannelName;
          let newChannelName;

          let oldparentname = "Desconocido";
          let oldchannelname = "Desconocido";
          let oldchanelid = "Desconocido";
          if (
            oldState &&
            oldState.channel &&
            oldState.channel.parent &&
            oldState.channel.parent.name
          )
            oldparentname = oldState.channel.parent.name;
          if (oldState && oldState.channel && oldState.channel.name)
            oldchannelname = oldState.channel.name;
          if (oldState && oldState.channelId) oldchanelid = oldState.channelId;

          let newparentname = "Desconocido";
          let newchannelname = "Desconocido";
          let newchanelid = "Desconocido";
          if (
            newState &&
            newState.channel &&
            newState.channel.parent &&
            newState.channel.parent.name
          )
            newparentname = newState.channel.parent.name;
          if (newState && newState.channel && newState.channel.name)
            newchannelname = newState.channel.name;
          if (newState && newState.channelId) newchanelid = newState.channelId;

          if (oldState.channelId && oldState.channel) {
            if (typeof oldState.channel.parent !== "Indefinido") {
              oldChannelName = `**Categoría:** ${oldparentname}\n\t**Nombre:** ${oldchannelname}\n**ID: **${oldchanelid}`;
            } else {
              oldChannelName = `-\n\t**Nombre:** ${oldparentname}\n**ID:** ${oldchanelid}`;
            }
          } else {
            oldChannelName = `[Canal De Escenario]`;
          }
          if (newState.channelId && newState.channel) {
            if (typeof newState.channel.parent !== "Indefinido") {
              newChannelName = `**Categoría:** ${newparentname}\n\t**Nombre:** ${newchannelname}\n**ID:** ${newchanelid}`;
            } else {
              newChannelName = `-\n\t**Nombre:** ${newchannelname}**\n**ID:** ${newchanelid}`;
            }
          } else {
            newChannelName = `[Canal De Escenario]`;
          }

          // JOINED V12
          if (!oldState.channelId && newState.channelId) {
            const joinembed = new discord.MessageEmbed()
              .setAuthor(
                `${newState.member.user.tag} | ¡Se unió al canal de voz!`,
                newState.member.user.displayAvatarURL()
              )
              .addField("Miembro", `${newState.member}`, true)
              .addField("Canal", `${newChannelName}`, true)
              .setColor(colorGreen)
              .setTimestamp()
              .setFooter({ text: `ID: ${newState.member.user.id}` });

            if (logging.server_events.voice.join == "true") {
              if (
                channelEmbed &&
                channelEmbed.viewable &&
                channelEmbed
                  .permissionsFor(newState.guild.me)
                  .has(["SEND_MESSAGES", "EMBED_LINKS"])
              ) {
                channelEmbed.send({ embeds: [joinembed] }).catch(() => {});
                cooldown.add(newState.guild.id);
                setTimeout(() => {
                  cooldown.delete(newState.guild.id);
                }, 3000);
              }
            }
          }

          // LEFT V12
          if (oldState.channelId && !newState.channelId) {
            const leaveembed = new discord.MessageEmbed()
              .setAuthor(
                `${newState.member.user.tag} | ¡Dejó el canal de voz!`,
                newState.member.user.displayAvatarURL()
              )
              .addField("Miembro", `${newState.member}`, true)
              .addField("Canal", `${oldChannelName}`, true)
              .setColor(colorRed)
              .setTimestamp()
              .setFooter({ text: `ID: ${newState.member.user.id}` });

            if (logging.server_events.voice.leave == "true") {
              if (
                channelEmbed &&
                channelEmbed.viewable &&
                channelEmbed
                  .permissionsFor(newState.guild.me)
                  .has(["SEND_MESSAGES", "EMBED_LINKS"])
              ) {
                channelEmbed.send({ embeds: [leaveembed] }).catch(() => {});
                cooldown.add(newState.guild.id);
                setTimeout(() => {
                  cooldown.delete(newState.guild.id);
                }, 3000);
              }
            }
          }

          // SWITCH V12
          if (oldState.channelId && newState.channelId) {
            // False positive check
            if (oldState.channelId !== newState.channelId) {
              const moveembed = new discord.MessageEmbed()
                .setAuthor(
                  `${newState.member.user.tag} | Movimientos De Canales De Voz`,
                  newState.member.user.displayAvatarURL()
                )
                .addField("Dejado", `${oldChannelName}`, true)
                .addField("Unido", `${newChannelName}`, true)
                .setColor(colorYellow)
                .setTimestamp()
                .setFooter({ text: `ID: ${newState.member.user.id}` });
              if (logging.server_events.voice.move == "true") {
                if (
                  channelEmbed &&
                  channelEmbed.viewable &&
                  channelEmbed
                    .permissionsFor(newState.guild.me)
                    .has(["SEND_MESSAGES", "EMBED_LINKS"])
                ) {
                  channelEmbed.send({ embeds: [moveembed] }).catch(() => {});
                  cooldown.add(newState.guild.id);
                  setTimeout(() => {
                    cooldown.delete(newState.guild.id);
                  }, 3000);
                }
              }
            }
          }
        }
      }
    }
  }
};
