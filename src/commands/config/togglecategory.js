const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "togglecategory",
      description: "Deshabilita o habilita una categoría en el servidor.",
      category: "Config",
      examples: ["togglecategory currency"],
      cooldown: 3,
      guildOnly: true,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const success = message.client.emoji.success;
    const fail = message.client.emoji.fail;

    if (!args[0])
      return message.channel.sendCustom(`¿Qué categoría desactivo?`);

    if (args.length === 0 || args[0].toLowerCase() === "Owner")
      return message.channel.sendCustom("¡Por favor, proporcione una categoría válida!");

    const type = args.slice(0).join(" ").toString().toLowerCase();
    let description;

    if (type === "config")
      return message.channel.sendCustom(
        `${fail} No puede deshabilitar la categoría de configuración.`
      );

    const typesMain = message.client.utils.removeDuplicates(
      message.client.botCommands
        .filter((cmd) => cmd.category !== "Owner")
        .map((cmd) => cmd.category)
    );

    const types = typesMain.map((item) => item.toLowerCase());

    const commands = message.client.botCommands
      .array()
      .filter((c) => c.category.toLowerCase() === type);

    let disabledCommands = guildDB.disabledCommands;
    if (typeof disabledCommands === "string")
      disabledCommands = disabledCommands.split(" ");

    if (types.includes(type)) {
      if (commands.every((c) => disabledCommands.includes(c.name || c))) {
        for (const cmd of commands) {
          if (disabledCommands.includes(cmd.name || cmd))
            removeA(disabledCommands, cmd.name || cmd);
        }
        description = `Todos los comandos \`${type}\` han sido **habilitados** con éxito ${success}`;
      } else {
        for (const cmd of commands) {
          if (!disabledCommands.includes(cmd.name || cmd)) {
            guildDB.disabledCommands.push(cmd.name || cmd);
          }
        }
        description = `Todos los comandos ${type} se han **deshabilitado** correctamente. ${fail}`;
      }
      await guildDB.save().catch(() => {});
      const disabledd =
        disabledCommands.map((c) => `\`${c}\``).join(" ") || "`None`";

      const embed = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
        .setDescription(description)
        .addField("Comandos Deshabilitados", disabledd, true)
        .setFooter({ text: "https://roxxy.es/" })
        .setTimestamp()
        .setColor(message.client.color.green);

      message.channel.sendCustom({ embeds: [embed] }).catch(() => {
        const errorEmbed = new discord.MessageEmbed()
          .setAuthor(
            message.author.tag,
            message.guild.iconURL({ dynamic: true })
          )
          .setDescription(description)
          .addField("Comandos deshabilitados", `[Demasiado grande para mostrar]`, true)
          .setFooter({ text: "https://roxxy.es/" })
          .setTimestamp()
          .setColor(message.client.color.green);
        message.channel.sendCustom(errorEmbed).catch(() => {});
      });
    } else
      return message.channel.sendCustom(
        `Por favor, proporcione una categoría válida\n\n**Categorías disponibles:**\n${typesMain.join(
          " - "
        )}`
      );
  }
};
function removeA(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}
