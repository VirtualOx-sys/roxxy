const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "setlanguage",
      aliases: ["setlang", "lang"],
      description: "Establece un idioma para el servidor",
      category: "Config",
      guildOnly: true,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    let languages = ["english", "french", "spanish", "arabic", "polish"];

    if (!args[0])
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(message.client.color.red)
            .setDescription(
              `${message.client.emoji.fail} | ${language.setLangMissingArgument}`
            ),
        ],
      });

    let setLangInvalidOption = language.setLangInvalidOption.replace(
      "{languages}",
      languages.join(", ")
    );
    if (!languages.includes(args[0].toLowerCase()))
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(message.client.color.red)
            .setDescription(
              `${message.client.emoji.fail} | ${setLangInvalidOption}`
            ),
        ],
      });

    let setLangChange = language.setLangChange.replace(
      "{language}",
      args[0].toLowerCase()
    );
    message.channel.sendCustom({
      embeds: [
        new discord.MessageEmbed()
          .setColor(message.client.color.green)
          .setDescription(`${message.client.emoji.success} | ${setLangChange}`),
      ],
    });

    await guildDB.updateOne({
      language: args[0].toLowerCase(),
    });
  }
};
