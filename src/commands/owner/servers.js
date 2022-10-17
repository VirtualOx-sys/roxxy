const Command = require("../../structures/Command");
const ReactionMenu = require("../../data/ReactionMenu.js");
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "servers",
      aliases: [],
      description: "¡Compruebe los servidores!",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message) {
    const servers = message.client.guilds.cache.map((guild) => {
      return `\`${guild.id}\` - **${guild.name}** - \`${guild.memberCount}\` miembros`;
    });

    const embed = new MessageEmbed()
      .setTitle("Lista De Servidores")
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({
          dynamic: true,
        })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (servers.length <= 10) {
      const range = servers.length == 1 ? "[1]" : `[1 - ${servers.length}]`;
      embed.setTitle(`Lista De Servidores ${range}`).setDescription(servers.join("\n"));

      message.channel.send({ embeds: [embed] });
    } else {
      new ReactionMenu(
        message.client,
        message.channel,
        message.member,
        embed,
        servers
      );
    }
  }
};
