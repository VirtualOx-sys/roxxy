const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "dogfact",
      aliases: ["df"],
      description: "Genera datos inútiles de perros al azar",
      category: "Diversion",
      cooldown: 3,
    });
  }

  async run(message) {
    const res = await fetch("https://dog-api.kinduff.com/api/facts");
    const fact = (await res.json()).facts[0];

    const embed = new MessageEmbed()
      .setDescription(fact)
      .setFooter({ text: `/dog-api.kinduff/api/fact` })
      .setTimestamp()
      .setColor(message.client.color.blue);
    message.channel.sendCustom({ embeds: [embed] }).catch(() => {});
  }
};
