const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");

const Guild = require("../../database/schemas/Guild");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "avatar",
      aliases: ["profilepic", "pic", "ava", "av"],
      usage: "[user]",
      description: "Muestra el avatar de un usuario.",
      category: "Informacion",
      examples: ["av", "av @VirtualOx"],
      cooldown: 3,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const match = message.content.match(/\d{18}/);
    let member = match
      ? message.guild.members.cache.get(match[0])
      : message.member;

    if (!member) member = message.member;

    const embed = new MessageEmbed()
      .setAuthor(
        `${language.pfpAvatar.replace("{user}", `${member.user.tag}`)}`,
        member.user.displayAvatarURL({ dynamic: true, size: 512 }),
        member.user.displayAvatarURL({ dynamic: true, size: 512 })
      )
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(member.displayHexColor);
    return message.channel.sendCustom({ embeds: [embed] });
  }
};
