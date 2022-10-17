const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "birdfact",
      aliases: ["birdfacts", "bf"],
      description: "Genera datos inútiles de pajaros al azar",
      category: "Diversion",
      cooldown: 3,
    });
  }

  async run(message) {
    const data = await fetch("https://some-random-api.ml/facts/bird")
      .then((res) => res.json())
      .catch(() => {});

    if (!data)
      return message.channel.sendCustom(
        `La API está actualmente inactiva, ¡vuelve más tarde!`
      );

    const { fact } = data;

    message.channel.sendCustom({
      embeds: [
        new MessageEmbed()

          .setColor(message.client.color.blue)
          .setDescription(`${fact}`)
          .setFooter({ text: "/some-random-api/bird" }),
      ],
    });
  }
};
