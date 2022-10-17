const Event = require("../../structures/Event");
const Discord = require("discord.js");
const config = require("../../../config.json");
const webhookClient = new Discord.WebhookClient({
  url: config.webhooks.errors,
});
const uuid = require("uuid");
const id = uuid.v4();

module.exports = class extends Event {
  async run(error, message) {
    console.log(error);

    const embed = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription(
        `**Usuario:** ${message.author} (${message.author.tag} - ${message.author.id})\n**Mensaje:** ${message.content}\n**Error:** ${error}\n**ID:** \`${id}\`\n\n__**Información Del Servidor**__\nNombre: ${message.guild.name}\nID: ${message.guild.id}\nCanal: ${message.channel.name} (${message.channel.id})`
      )
      .setTimestamp();

    webhookClient.sendCustom(embed);
  }
};
