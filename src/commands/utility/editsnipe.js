const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Snipe = require("../../database/schemas/editsnipe");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "editsnipe",
      description: "Snipe de mensajes editados en el canal",
      category: "Utilidad",
      usage: ["editsnipe"],
      cooldown: 10,
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
        `${message.client.emoji.fail} | No se pudo encontrar ningún mensaje editado en **${channel.name}**`
      );

    if (!snipe) {
      return message.channel.sendCustom(no);
    }

    if (snipe.oldmessage.length < 1) {
      return message.channel.sendCustom(no);
    }
    if (snipe.newmessage.length < 1) {
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

    for (let i = 0; snipe.oldmessage.length > i; i++) {
      data.push(`**${i + 1}**`);

      embed.addField(
        `Mensaje #${i + 1}`,
        `**Usuario:** ${
          (await message.client.users.fetch(snipe.id[i])) || "Desconocido"
        }\n**Mensaje:** ${snipe.oldmessage[i] || "Ninguno"} ➜ ${
          snipe.newmessage[i]
        }\n[Saltar Al Mensaje](${snipe.url[i]})\n`
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
