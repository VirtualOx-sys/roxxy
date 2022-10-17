const discord = require("discord.js");
const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "reverse",
      aliases: ["rev"],
      description: "Envía el mismo mensaje que habías enviado pero al revés.",
      category: "Diversion",
      usage: "<texto>",
      examples: ["reverse Hola Mundo"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    if (!args[0]) return message.channel.sendCustom(`${language.reverseError}`);
    const text = args.join(" ");
    const converted = text.split("").reverse().join("");
    message.channel
      .sendCustom(
        new discord.MessageEmbed()
          .setDescription(`\u180E${converted}`)
          .setColor(message.client.color.blue)
      )
      .catch(() => {});
  }
};
