const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const ReactionRole = require("../../packages/reactionrole/index.js");
const react = new ReactionRole();

require("dotenv").config();
react.setURL(process.env.MONGO);

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "rrtypes",
      aliases: ["rrtype", "reactionroletypes"],
      description: "Observa los diferentes tipos de opciones permitidas para los roles por reacción",
      category: "Rol Por Reaccion",
      cooldown: 3,
    });
  }

  async run(message) {
    let client = message.client;

    const embedType = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `\`Tipo 1\` - Reaccionar agrega el rol, no reaccionar elimina el rol\n\`Tipo 2\` - La reacción otorgará el rol, la falta de reacción no eliminará el rol\n\`Tipo 3\` - Reaccionar eliminará el rol y no reaccionar no lo devolverá\n\`Tipo 4\` - Al reaccionar eliminará el rol, al no reaccionar agregará el rol\n\`Tipo 5\` - Lo mismo que el número 3, pero elimina la reacción del usuario\n\`Type 6\` - Reacciona para recibir el rol, reacciona de nuevo para eliminar el rol`)
      .setFooter({ text: "https://roxxy.es" })
      .setColor(client.color.red);

    message.channel.sendCustom(embedType);
  }
};
