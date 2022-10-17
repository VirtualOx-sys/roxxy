const Event = require("../../structures/Event");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Event {
  async run(permissions, message) {
    if (!message) return;
    const embed = new MessageEmbed()
      .setAuthor(
        `${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTitle(`X Faltan Permisos De Usuario`)
      .setDescription(
        `Permiso requerido: \`${permissions.replace("_", " ")}\``
      )
      .setTimestamp()
      .setFooter({ text: "https://roxxy.es" })
      .setColor(message.guild.me.displayHexColor);
    if (
      message.channel &&
      message.channel.viewable &&
      message.channel
        .permissionsFor(message.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"])
    ) {
      message.channel.sendCustom({ embeds: [embed] }).catch(() => {});
    }
  }
};
