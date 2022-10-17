const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { stripIndent } = require("common-tags");
const emojis = require("../../assets/emojis.json");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "help",
      aliases: ["menu", "bothelp", "commands"],
      description: "Shows you every available command in the guild",
      category: "Informacion",
      usage: "[command]",
      examples: ["help userinfo", "help avatar"],
      cooldown: 3,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({ guildId: message.guild.id });

    let disabledCommands = guildDB.disabledCommands;
    if (typeof disabledCommands === "string")
      disabledCommands = disabledCommands.split(" ");

    const prefix = guildDB.prefix;

    const emoji = {
      detectoralt: `${emojis.altdetector}`,
      aplicaciones: `${emojis.applications}`,
      config: `${emojis.config}`,
      utilidad: `${emojis.utility}`,
      economy: `${emojis.economy}`,
      diversion: `${emojis.fun}`,
      imagenes: `${emojis.images}`,
      informacion: `${emojis.information}`,
      moderacion: `${emojis.moderation}`,
      rolporreaccion: `${emojis.reactionrole}`,
      tickets: `${emojis.tickets}`,
      owner: `${emojis.owner}`,
    };

    const green = "<:roxxy_right:1019323266420199424>";
    const red = "<:roxxy_left:1019323342269976616>";

    const embed = new MessageEmbed().setColor("ORANGE");

    if (!args || args.length < 1) {
      let categories;
      categories = this.client.utils.removeDuplicates(
        this.client.botCommands
          .filter((cmd) => cmd.category !== "Owner")
          .map((cmd) => cmd.category)
      );

      if (this.client.config.developers.includes(message.author.id))
        categories = this.client.utils.removeDuplicates(
          this.client.botCommands.map((cmd) => cmd.category)
        );

      for (const category of categories) {
        embed.addField(
          `${emoji[category.split(" ").join("").toLowerCase()]} **${capitalize(
            category
          )}**`,
          `\`${prefix}help ${category.toLowerCase()}\``,
          true
        );
      }
      embed.setTitle(`Lista De Comandos De Roxxy`);
      embed.setDescription(stripIndent`
        <:Dot:1015695737012633610> El prefijo para este servidor es \`${prefix}\`
  
        `);

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });
      embed.setTimestamp();

      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args.join(" ").toLowerCase() == "detector alt") ||
      (args && args[0].toLowerCase() == "alt")
    ) {
      embed.setTitle(` ${emojis.altdetector} - Detector Alt`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "detector alt")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(9 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });
      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (args && args[0].toLowerCase() == "owner") {
      if (!this.client.config.developers.includes(message.author.id))
        return message.channel.sendCustom(
          `${message.client.emoji.fail} | No tienes permiso para ver esta categoría.`
        );

      embed.setTitle(`${emojis.owner} Comandos De Propietario`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "owner")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args[0].toLowerCase() == "aplicaciones") ||
      (args && args[0].toLowerCase() == "apps")
    ) {
      embed.setTitle(` ${emojis.applications} - Aplicaciones`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "aplicaciones")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();

      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );

      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args[0].toLowerCase() == "config") ||
      (args && args[0].toLowerCase() == "configuracion")
    ) {
      embed.setTitle(` ${emojis.config} - Config`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "config")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(14 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args[0].toLowerCase() == "utilidad") ||
      (args && args[0].toLowerCase() == "utils")
    ) {
      embed.setTitle(` ${emojis.utility} - Utilidad`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "utilidad")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(10 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args[0].toLowerCase() == "economia") ||
      (args && args[0].toLowerCase() == "currency")
    ) {
      embed.setTitle(` ${emojis.economy} - Economía`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "economia")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(9 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (args && args[0].toLowerCase() == "diversion") {
      embed.setTitle(` ${emojis.fun} - Diversión`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "diversion")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(10 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args[0].toLowerCase() == "imagenes") ||
      (args && args[0].toLowerCase() == "image")
    ) {
      embed.setTitle(` ${emojis.images} - Imagen`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "imagenes")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(14 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args[0].toLowerCase() == "informacion") ||
      (args && args[0].toLowerCase() == "info")
    ) {
      embed.setTitle(` ${emojis.information} - Info`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "informacion")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args[0].toLowerCase() == "moderacion") ||
      (args && args[0].toLowerCase() == "mod")
    ) {
      embed.setTitle(` ${emojis.moderation} - Moderación`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "moderacion")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );
      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args.slice(0).join(" ").toLowerCase() == "rol por reaccion") ||
      (args && args[0].toLowerCase() == "rr")
    ) {
      embed.setTitle(` ${emojis.reactionrole} - Roles Por Reacción`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "rol por reaccion")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(12 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );

      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );

      return message.channel.sendCustom({ embeds: [embed] });
    } else if (
      (args && args[0].toLowerCase() == "tickets") ||
      (args && args[0].toLowerCase() == "ticketing")
    ) {
      embed.setTitle(` ${emojis.tickets} - Tickets`);
      embed.setDescription(
        this.client.botCommands
          .filter((cmd) => cmd.category.toLowerCase() === "tickets")
          .map(
            (cmd) =>
              `${
                cmd.disabled || disabledCommands.includes(cmd.name || cmd)
                  ? red
                  : green
              } \`${cmd.name} ${" ".repeat(11 - Number(cmd.name.length))}:\` ${
                cmd.description
              }`
          )
          .join("\n")
      );
      embed.addField(
        "\u200b",
        "**[Invitar](https://invite.roxxy.es) | " +
          "[Servidor De Soporte](https://roxxy.es/support) | " +
          "[Panel](https://roxxy.es/dashboard)**"
      );
      embed.setFooter({
        text: `Solicitado por ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

      embed.setTimestamp();

      return message.channel.sendCustom({ embeds: [embed] });
    } else {
      const cmd =
        this.client.botCommands.get(args[0]) ||
        this.client.botCommands.get(this.client.aliases.get(args[0]));

      if (!cmd)
        return message.channel.sendCustom(
          `${message.client.emoji.fail} No se pudo encontrar el comando que está buscando`
        );

      if (cmd.category === "Owner")
        return message.channel.sendCustom(
          `${message.client.emoji.fail} No se pudo encontrar el comando que está buscando`
        );

      embed.setTitle(`Comando: ${cmd.name}`);
      embed.setDescription(cmd.description);
      embed.setThumbnail(`https://roxxy.es/logo.png`);
      embed.setFooter(
        cmd.disabled ||
          disabledCommands.includes(args[0] || args[0].toLowerCase())
          ? "Este comando está actualmente deshabilitado."
          : message.member.displayName,
        message.author.displayAvatarURL({ dynamic: true })
      );

      embed.addField("Uso", `\`${cmd.usage}\``, true);
      embed.addField("categoría", `\`${capitalize(cmd.category)}\``, true);

      if (cmd.aliases && cmd.aliases.length && typeof cmd.aliases === "object")
        embed.addField(
          "Alias",
          cmd.aliases.map((alias) => `\`${alias}\``, true).join(", "),
          true
        );
      if (cmd.cooldown && cmd.cooldown > 1)
        embed.addField("Enfriamiento", `\`${cmd.cooldown}s\``, true);
      if (cmd.examples && cmd.examples.length)
        embed.addField(
          "__**Ejemplos**__",
          cmd.examples
            .map((example) => `<:Dot:1015695737012633610> \`${example}\``)
            .join("\n")
        );

      return message.channel.sendCustom({ embeds: [embed] });
    }
  }
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
