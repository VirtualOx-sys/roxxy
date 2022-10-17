const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const customCommand = require("../../database/schemas/customCommand.js");
const Guild = require("../../database/schemas/Guild");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "deletecommand",
      description: "Elimina un comando personalizado",
      category: "Config",
      userPermission: "MANAGE_MESSAGES",
      aliases: ["delcommand", "removecommand"],
      usage: ["<comando>"],
      examples: ["deletecommand Rox"],
      cooldown: 3,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    let prefix = guildDB.prefix;

    const language = require(`../../data/language/${guildDB.language}.json`);

    const name = args[0].toLowerCase();

    if (!name)
      return message.channel
        .sendCustom({
          embeds: [
            new MessageEmbed()
              .setAuthor(
                `${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setDescription(
                `${language.properusage} \`${prefix}deletecommand <nombre-comando>\`\n\n${language.example} \`${prefix}deletecommand Rox\``
              )
              .setTimestamp()
              .setFooter({ text: "https://roxxy.es/" }),
          ],
        })
        .setColor(message.guild.me.displayHexColor);

    if (name.length > 30)
      return message.channel.sendCustom(
        `${message.client.emoji.fail} ${language.cc1}`
      );

    customCommand.findOne(
      {
        guildId: message.guild.id,
        name,
      },
      async (err, data) => {
        if (data) {
          data.delete({ guildId: message.guild.id, name });
          message.channel.sendCustom({
            embeds: [
              new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setAuthor(
                  `${message.author.tag}`,
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setTitle(`${message.client.emoji.success} Eliminar comando`)
                .setDescription(`${language.deletecmd1} **${name}**`)
                .setTimestamp()
                .setFooter({ text: "https://roxxy.es/" }),
            ],
          });
        } else {
          message.channel.sendCustom(
            `${message.client.emoji.fail} ${language.deletecmd2}`
          );
        }
      }
    );
  }
};
