const Command = require("../../structures/Command");
const fetch = require("node-fetch");
const Guild = require("../../database/schemas/Guild");
const discord = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "bird",
      description: "¡Consigue una foto de un pájaro!",
      category: "Imagenes",
      cooldown: 5,
    });
  }

  async run(message) {
    const client = message.client;
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    try {
      const res = await fetch("http://shibe.online/api/birds");
      const img = (await res.json())[0];
      const embed = new discord.MessageEmbed()
        .setImage(img)
        .setFooter({ text: `/shibe.online/api/birds` })
        .setTimestamp()
        .setColor(client.color.red);
      message.channel.sendCustom({ embeds: [embed] });
    } catch (err) {
      console.log(`${err}, nombre del comando: bird`);
      message.reply(language.birdError);
    }
  }
};
