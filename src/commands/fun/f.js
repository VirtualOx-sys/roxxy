const discord = require("discord.js");
const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "f",
      description: "¡Muestra tu respeto!",
      category: "Diversion",
      cooldown: 3,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    const target = message.mentions.users.first();

    if (!args[0]) {
      message.delete().catch(() => {});
      const embed = new discord.MessageEmbed()
        .setAuthor(
          `${message.author.username} ha presentado sus respetos.`,
          message.author.displayAvatarURL({ format: "png" })
        )
        .setColor("ORANGE")
        .setFooter({ text: `${language.f3}` });
      message.channel
        .sendCustom({ embed })
        .then((m) => m.react("🇫"))
        .catch(() => {});
    } else {
      message.delete().catch(() => {});
      const embed = new discord.MessageEmbed()
        .setAuthor("\u2000", message.author.displayAvatarURL({ format: "png" }))
        .setColor("ORANGE")
        .setDescription(`${message.author} ${language.f2} ${target}`)
        .setFooter({ text: `${language.f3}` });
      message.channel
        .sendCustom({ embed })
        .then((m) => m.react("🇫"))
        .catch(() => {});
    }
  }
};
