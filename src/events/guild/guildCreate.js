const Event = require("../../structures/Event");
const Discord = require("discord.js");
const logger = require("../../utils/logger");
const Guild = require("../../database/schemas/Guild");
const Logging = require("../../database/schemas/logging");
const config = require("../../../config.json");
const webhookClient = new Discord.WebhookClient({
  url: config.webhooks.joinsPublic,
});
const welcomeClient = new Discord.WebhookClient({
  url: config.webhooks.joinsPrivate,
});

module.exports = class extends Event {
  async run(guild) {
    logger.info(`Unido a "${guild.name}" (${guild.id})`, { label: "Servidores" });

    const find = await Guild.findOne({
      guildId: guild.id,
    });

    if (!find) {
      const guildConfig = await Guild.create({
        guildId: guild.id,
        language: "spanish",
      });
      await guildConfig.save().catch(() => {});
    }

    var textChats = guild.channels.cache.find(
      (ch) =>
        ch.type === "GUILD_TEXT" &&
        ch
          .permissionsFor(guild.me)
          .has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"])
    );

    const modLog = guild.channels.cache.find(
      (c) =>
        c.name.replace("-", "").replace("s", "") === "modlog" ||
        c.name.replace("-", "").replace("s", "") === "moderatorlog"
    );

    let muteRole = guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "silenciado"
    );
    if (!muteRole) {
      try {
        muteRole = await guild.roles.create({
          data: {
            name: "Silenciado",
            permissions: [],
          },
        });
      } catch (e) {
        // do nothing
      }
      for (const channel of guild.channels.cache.values()) {
        try {
          if (
            channel.viewable &&
            channel.permissionsFor(guild.me).has("MANAGE_ROLES")
          ) {
            if (channel.type === "GUILD_TEXT")
              await channel.permissionOverwrites.edit(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
              });
            else if (channel.type === "GUILD_VOICE" && channel.editable)
              //
              await channel.permissionOverwrites.edit(muteRole, {
                SPEAK: false,
                STREAM: false,
              });
          }
        } catch (e) {
          // do nothing
        }
      }
    }

    const logging = await Logging.findOne({
      guildId: guild.id,
    });
    if (!logging) {
      const newL = await Logging.create({
        guildId: guild.id,
      });
      await newL.save().catch(() => {});
    }

    const logging2 = await Logging.findOne({
      guildId: guild.id,
    });

    if (logging2) {
      if (muteRole) {
        logging2.moderation.mute_role = muteRole.id;
      }

      if (modLog) {
        logging2.moderation.channel = modLog.id;
      }
      await logging2.save().catch(() => {});
    }

    if (textChats) {
      const embed = new Discord.MessageEmbed()
        .setColor("PURPLE")
        .setDescription(
          `¡Hola, Roxxers! Soy **Roxxy**.\n\n¡Gracias por invitarme a su servidor, ya que significa mucho para nosotros! Puede comenzar con [\`r!help\`](https://roxxy.es) y personalizar la configuración de su servidor accediendo al panel [\`aquí\`](https://roxxy.es/dashboard/${guild.id}).\n\n__**Noticias Actuales**__\n\`\`\`\nSi desea estar enterado de todo lo relacionado con el desarrollo del bot, incidentes, sorteos, etc. Puede usar el comando r!news\`\`\`\n\nDe nuevo, ¡gracias por invitarme! (este servidor ahora es muy roxx)\n**- Roxxy**`
        )
        .addField(
          "\u200b",
          "**[Invitación](https://invite.roxxy.es) | " +
            "[Servidor De Soporte](https://roxxy.es/support) | " +
            "[Panel](https://roxxy.es/dashboard)**"
        );

      textChats.send({ embeds: [embed] }).catch(() => {});
    }

    const welcomeEmbed = new Discord.MessageEmbed()
      .setColor(`PURPLE`)
      .setTitle("Nuevo Servidor")
      .setThumbnail(`https://roxxy.es/logo`)
      .setDescription(`¡Roxxy se agregó a un nuevo servidor!`)
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

    const embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(
        `Me he unido al servidor ${guild.name}.\n\nID: ${guild.id}`
      )
      .setFooter({
        text: `He ganado ${guild.members.cache.size - 1} miembros • ¡Ahora estoy en ${
          this.client.guilds.cache.size
        } servidores!`,
      })
      .setThumbnail(
        guild.iconURL({ dynamic: true })
          ? guild.iconURL({ dynamic: true })
          : `https://guild-default-icon.herokuapp.com/${encodeURIComponent(
              guild.name
            )}`
      );

    webhookClient.sendCustom({
      username: "Roxxy",
      avatarURL: "https://roxxy.es/logo.png",
      embeds: [embed],
    });
  }
};
