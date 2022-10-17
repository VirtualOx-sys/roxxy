const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const ReactionRole = require("../../packages/reactionrole/models/schema");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "rrwipe",
      aliases: ["reactionrolewipe", "reactionroleswipe"],
      description: "Borra todos los roles por reacción del servidor actual",
      category: "Rol Por Reaccion",
      cooldown: 3,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message) {
    const conditional = {
      guildid: message.guild.id,
    };
    const results = await ReactionRole.find(conditional);

    if (results && results.length) {
      for (const result of results) {
        try {
          await result.deleteOne();
        } catch (e) {
          console.log(e);
        }
      }
    }

    let resultsHeheLol = results.length;
    let resultsHehe = `roles por reaccion`;
    if (resultsHeheLol == "1") resultsHehe = "rol por reaccion";

    if (resultsHeheLol === "0" || !results || !results.length) {
      let wipeEmbed3 = new MessageEmbed()
        .setColor(message.client.color.green)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`¡El servidor actual no tiene roles por reacción existentes!`)
        .setFooter({ text: "https://roxxy.es" });

      message.channel.sendCustom(wipeEmbed3);

      return;
    }

    let wipeEmbed = new MessageEmbed()
      .setColor(message.client.color.green)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(
        `Eliminado con éxito **${results.length}** ${resultsHehe}`
      )
      .setFooter({ text: "https://roxxy.es" });

    message.channel.sendCustom(wipeEmbed);
  }
};
