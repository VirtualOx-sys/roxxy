const Command = require("../../structures/Command");
const figlet = require("util").promisify(require("figlet"));
const Guild = require("../../database/schemas/Guild");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "asciify",
      aliases: ["bigtext", "banner"],
      description: "Convierte tu texto en un arte ASCII.",
      category: "Diversion",
      usage: "<texto>",
      cooldown: 3,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    if (args.length < 1) {
      return message.channel.sendCustom(
        `${message.client.emoji.fail} ${language.changeErrorValid}`
      );
    }

    return message.channel
      .sendCustom(await figlet(args), { code: true })
      .catch(() => {
        message.channel.sendCustom(`${language.bigError}`);
      });
  }
};
