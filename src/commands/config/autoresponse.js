const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const autoResponse = require("../../database/schemas/autoResponse.js");
const Guild = require("../../database/schemas/Guild");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "autoresponse",
      description:
        "¡Cree una respuesta automática que se active sin prefijo!",
      category: "Config",
      aliases: ["ar", "aresponse"],
      usage: ["<comando> <respuesta>"],
      examples: ["¡Respuesta automática Roxxers!"],
      cooldown: 3,
      userPermission: ["MANAGE_GUILD"],
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    let prefix = guildDB.prefix;

    const language = require(`../../data/language/${guildDB.language}.json`);
    const namee = args[0];

    if (!namee)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(
              `${message.author.tag}`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
              `${language.properusage} \`${prefix}autoResponse <nombre-comando> <respuesta-texto>\`\n\n${language.example} \`${prefix}autoResponse ping pong\``
            )
            .setTimestamp()
            .setFooter({ text: "https://roxxy.es/" })
            .setColor(message.guild.me.displayHexColor),
        ],
      });

    let name = namee.toLowerCase();
    const content = args.slice(1).join(" ");
    if (!content)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(
              `${message.author.tag}`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
              `${language.properusage} \`${prefix}autoResponse <nombre-comando> <respuesta-texto>\`\n\n${language.example} \`${prefix}autoResponse ping pong\``
            )
            .setTimestamp()
            .setFooter({ text: "https://roxxy.es/" })
            .setColor(message.guild.me.displayHexColor),
        ],
      });

    if (namee.length > 30)
      return message.channel.sendCustom(
        `${message.client.emoji.fail} ${language.cc1}`
      );
    if (content.length > 2000)
      return message.channel.sendCustom(
        `${message.client.emoji.fail} ${language.cc2}`
      );

    if (guildDB.isPremium === "false") {
      const conditional = {
        guildId: message.guild.id,
      };
      const results = await autoResponse.find(conditional);

      if (results.length >= 10) {
        message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
              .setColor(message.guild.me.displayHexColor)
              .setDescription(
                `${message.client.emoji.fail} Límite de respuesta automática alcanzado **(10)**\n\n[Actualice Premium aquí para comandos ilimitados](https://roxxy.es/premium)`
              ),
          ],
        });

        return;
      }
    }

    autoResponse.findOne(
      {
        guildId: message.guild.id,
        name,
      },
      async (err, data) => {
        if (!data) {
          autoResponse.create({ guildId: message.guild.id, name, content });
          message.channel.sendCustom({
            embeds: [
              new MessageEmbed()
                .setAuthor(
                  `${message.author.tag}`,
                  message.author.displayAvatarURL({ dynamic: true })
                )
                .setDescription(
                  `**${language.cc3}** ${name}\n\nElimine la siguiente respuesta automática usando \`${prefix}deleteresponse <nombre-comando>\``
                )
                .setTimestamp()
                .setFooter({ text: "https://roxxy.es/" })
                .setColor(message.guild.me.displayHexColor),
            ],
          });
        } else {
          return message.channel.sendCustom(
            `${message.client.emoji.fail} ${language.cc4}`
          );
        }
      }
    );
  }
};
