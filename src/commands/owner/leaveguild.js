const Command = require("../../structures/Command");
const rgx = /^(?:<@!?)?(\d+)>?$/;
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "leaveguild",
      aliases: ["lg"],
      description: "¡Dejo un servidor!",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return message.channel.sendCustom(`Proporciona un servidor`);
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.sendCustom(`ID de servidor no válido`);
    await guild.leave();
    const embed = new MessageEmbed()
      .setTitle("Abandonar Servidor")
      .setDescription(`He salido con exito de **${guild.name}**.`)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.sendCustom({ embeds: [embed] });
  }
};
