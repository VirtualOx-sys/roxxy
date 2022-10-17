const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "kick",
      aliases: ["k"],
      description: "Expulsa al usuario especificado de su servidor Discord.",
      category: "Moderacion",
      usage: "<usuario> [razón]",
      examples: ["kick @VirtualOx Rompiendo las reglas"],
      guildOnly: true,
      botPermission: ["KICK_MEMBERS"],
      userPermission: ["KICK_MEMBERS"],
    });
  }

  async run(message, args) {
    const client = message.client;

    const logging = await Logging.findOne({ guildId: message.guild.id });
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    const language = require(`../../data/language/${guildDB.language}.json`);

    let member =
      message.mentions.members.last() ||
      message.guild.members.cache.get(args[0]);

    if (!member)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.banUserValid}`)
            .setColor(client.color.red),
        ],
      });

    if (member.id === message.author.id)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.kickYourself}`)
            .setColor(client.color.red),
        ],
      });

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.banHigherRole}`)
            .setColor(client.color.red),
        ],
      });

    if (!member.kickable)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setDescription(`${client.emoji.fail} | ${language.kickKickable}`)
            .setColor(client.color.red),
        ],
      });

    let reason = args.slice(1).join(" ");
    if (!reason) reason = `${language.noReasonProvided}`;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    await member
      .kick(`${reason} / Usuario responsable: ${message.author.tag}`)
      .catch((err) =>
        message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
              .setColor(client.color.red)
              .setDescription(
                `${client.emoji.fail} | Ocurrió un error: ${err}`
              ),
          ],
        })
      );

    const embed = new MessageEmbed()
      .setDescription(
        `${client.emoji.success} | **${member.user.tag}** ${
          language.kickKick
        } ${
          logging && logging.moderation.include_reason === "true"
            ? `\n\n**Razón:** ${reason}`
            : ``
        }`
      )
      .setColor(client.color.green);

    message.channel
      .sendCustom({ embeds: [embed] })

      .then(async (s) => {
        if (logging && logging.moderation.delete_reply === "true") {
          setTimeout(() => {
            s.delete().catch(() => {});
          }, 5000);
        }
      })
      .catch(() => {});
    let dmEmbed;
    if (
      logging &&
      logging.moderation.kick_action &&
      logging.moderation.kick_action !== "1"
    ) {
      if (logging.moderation.kick_action === "2") {
        dmEmbed = `${message.client.emoji.fail} Te han expulsado en **${message.guild.name}**`;
      } else if (logging.moderation.kick_action === "3") {
        dmEmbed = `${message.client.emoji.fail} Te han expulsado en **${message.guild.name}**\n\n__**Razón:**__ ${reason}`;
      } else if (logging.moderation.kick_action === "4") {
        dmEmbed = `${message.client.emoji.fail} Te han expulsado en **${message.guild.name}**\n\n__**Moderador:**__ ${message.author} **(${message.author.tag})**\n__**Razón:**__ ${reason}`;
      }

      member
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(message.client.color.red)
              .setDescription(dmEmbed),
          ],
        })
        .catch(() => {});
    }

    if (logging) {
      if (logging.moderation.delete_after_executed === "true") {
        message.delete().catch(() => {});
      }

      const role = message.guild.roles.cache.get(
        logging.moderation.ignore_role
      );
      const channel = message.guild.channels.cache.get(
        logging.moderation.channel
      );

      if (logging.moderation.toggle == "true") {
        if (channel) {
          if (message.channel.id !== logging.moderation.ignore_channel) {
            if (
              !role ||
              (role &&
                !message.member.roles.cache.find(
                  (r) => r.name.toLowerCase() === role.name
                ))
            ) {
              if (logging.moderation.kick == "true") {
                let color = logging.moderation.color;
                if (color == "#000000") color = message.client.color.red;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                let reason = args.slice(1).join(" ");
                if (!reason) reason = `${language.noReasonProvided}`;
                if (reason.length > 1024)
                  reason = reason.slice(0, 1021) + "...";

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Acción: \`Kick\` | ${member.user.tag} | Caso #${logcase}`,
                    member.user.displayAvatarURL({ format: "png" })
                  )
                  .addField("Usuario", `${member}`, true)
                  .addField("Moderador", `${message.member}`, true)
                  .addField("Razón", `${reason}`, true)
                  .setFooter({ text: `ID: ${member.id}` })
                  .setTimestamp()
                  .setColor(color);

                channel.send({ embeds: [logEmbed] }).catch(() => {});

                logging.moderation.caseN = logcase + 1;
                await logging.save().catch(() => {});
              }
            }
          }
        }
      }
    }
  }
};