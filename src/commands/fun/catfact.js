const Command = require("../../structures/Command");
const fetch = require("node-fetch");

const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "catfact",
      aliases: ["catfacts", "cf"],
      description: "Genera datos inútiles de gatos al azar",
      category: "Diversion",
      cooldown: 3,
    });
  }

  async run(message) {
    const res = await fetch("https://catfact.ninja/fact").catch(() => {});
    const fact = (await res.json()).fact;
    const embed = new MessageEmbed()
      .setDescription(fact)
      .setFooter({ text: `/catfact.ninja/fact` })
      .setTimestamp()
      .setColor(message.client.color.blue);
    message.channel.sendCustom({ embeds: [embed] }).catch(() => {});
  }
};
