const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "invite",
      aliases: ["inv"],
      description: "Te envía un enlace de invitación de Roxxy",
      category: "Utilidad",
      cooldown: 3,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setDescription(
        `${language.invite}(https://roxxy.es/invite) ${message.client.emoji.success}`
      );

    await message.channel.sendCustom({ embeds: [embed] });
  }
};
