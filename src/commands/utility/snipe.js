const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Snipe = require("../../database/schemas/snipe");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "snipe",
      description: "Snipe Mensajes en el canal",
      category: "Utilidad",
      usage: ["snipe"],
      cooldown: 5,
    });
  }

  async run(message) {
    let channel = message.mentions.channels.first();
    if (!channel) channel = message.channel;

    const snipe = await Snipe.findOne({
      guildId: message.guild.id,
      channel: channel.id,
    });

    const no = new MessageEmbed()
      .setAuthor(
        `#${channel.name} | ${message.guild.name}`,
        message.guild.iconURL()
      )
      .setFooter({ text: message.guild.name })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor)
      .setDescription(
        `${message.client.emoji.fail} | No se pudo encontrar ningún mensaje eliminado en **${channel.name}**`
      );

    if (!snipe) {
      return message.channel.sendCustom(no);
    }

    if (snipe.message.length < 1) {
      return message.channel.sendCustom(no);
    }

    const data = [];

    const embed = new MessageEmbed()
      .setAuthor(
        `#${channel.name} | ${message.guild.name}`,
        message.guild.iconURL()
      )
      .setFooter({ text: message.guild.name })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    for (let i = 0; snipe.message.length > i; i++) {
      data.push(
        `**${i + 1}-**\n**Usuario:** ${
          (await message.client.users.fetch(snipe.tag[i])) || "Desconocido"
        }\n**Mensaje:** ${snipe.message[i] || "Ninguno"}\n**Imagen:** \`${
          snipe.image[i] || "Ninguna"
        }\``
      );

      embed.addField(
        `Mensaje ${i + 1}`,
        `**Usuario:** ${
          (await message.client.users.fetch(snipe.tag[i])) || "Desconocido"
        }\n**Mensaje:** ${snipe.message[i] || "Ninguno"}\n**Imagen:** \`${
          snipe.image[i] || "Ninguna"
        }\``,
        true
      );
    }

    if (data.length < 1) return message.channel.sendCustom(no);

    message.channel.sendCustom({ embeds: [embed] }).catch(async () => {
      await snipe.deleteOne().catch(() => {});
      message.channel.sendCustom(
        `El embed contenía un campo enorme que no cabía, ya que esta es la razón por la que no pude enviar el embed. He restablecido la base de datos, ya que puede intentar volver a ejecutar el comando.`
      );
    });
  }
};
