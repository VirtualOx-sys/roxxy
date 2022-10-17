const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "togglecommand",
      description: "Deshabilita o habilita comandos en el servidor",
      category: "Config",
      examples: ["togglecommand ping"],
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
      return message.channel.sendCustom(`¿Qué comando desactivo?`);

    const command =
      this.client.botCommands.get(args[0]) || this.client.aliases.get(args[0]);

    if (!command || (command && command.category == "Owner"))
      return message.channel.sendCustom("¡Proporcione un comando válido!");

    if (command && command.category === "Config")
      return message.channel.sendCustom(
        `${fail} No puede deshabilitar los comandos de configuración.`
      );

    let disabled = guildDB.disabledCommands;
    if (typeof disabled === "string") disabled = disabled.split(" ");

    let description;

    if (!disabled.includes(command.name || command)) {
      guildDB.disabledCommands.push(command.name || command);
      description = `El comando \`${
        command.name || command
      }\` se ha **deshabilitado** con éxito. ${fail}`;
    } else {
      removeA(disabled, command.name || command);
      description = `El comando \`${
        command.name || command
      }\` se ha **habilitado** con éxito. ${success}`;
    }
    await guildDB.save().catch(() => {});

    const disabledCommands =
      disabled.map((c) => `\`${c}\``).join(" ") || "`None`";

    const embed = new discord.MessageEmbed()
      .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField("Comandos Deshabilitados", disabledCommands, true)
      .setFooter({ text: "https://roxxy.es/" })
      .setTimestamp()
      .setColor(message.client.color.green);
    message.channel.sendCustom({ embeds: [embed] }).catch(() => {
      const errorEmbed = new discord.MessageEmbed()
        .setAuthor(message.author.tag, message.guild.iconURL({ dynamic: true }))
        .setDescription(description)
        .addField("Comandos Deshabilitados", `[Demasiado grande para mostrar]`, true)
        .setFooter({ text: "https://roxxy.es/" })
        .setTimestamp()
        .setColor(message.client.color.green);
      message.channel.sendCustom(errorEmbed).catch(() => {});
    });
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
