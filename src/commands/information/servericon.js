const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "servericon",
      aliases: ["sicon"],
      description: "Muestra el icono del servidor actual",
      category: "Informacion",
      cooldown: 3,
    });
  }

  async run(message) {
    const embed = new MessageEmbed()
      .setAuthor(
        `Ícono del servidor ${message.guild.name}`,
        " ",
        message.guild.iconURL({ dynamic: true, size: 512 })
      )
      .setImage(message.guild.iconURL({ dynamic: true, size: 512 }))
      .setFooter({
        text: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.sendCustom({ embeds: [embed] });
  }
};
