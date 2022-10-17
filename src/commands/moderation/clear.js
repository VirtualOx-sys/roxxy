const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "clear",
      aliases: ["clear", "c", "purge"],
      description: "Elimina la cantidad especificada de mensajes",
      category: "Moderacion",
      usage: "purge [canal] [usuario] <cantidad-de-mensajes> [razón]",
      examples: [
        "purge 20",
        "purge #general 10",
        "purge @VirtualOx 50",
        "purge #general @VirtualOx 5",
      ],
      guildOnly: true,
      botPermission: ["MANAGE_MESSAGES"],
      userPermission: ["MANAGE_MESSAGES"],
    });
  }

  async run(message, args) {
    try {
      const logging = await Logging.findOne({ guildId: message.guild.id });

      const client = message.client;
      const fail = client.emoji.fail;
      const success = client.emoji.success;

      let channel =
        getChannelFromMention(message, args[0]) ||
        message.guild.channels.cache.get(args[0]);
      if (channel) {
        args.shift();
      } else channel = message.channel;

      if (channel.type != "GUILD_TEXT" || !channel.viewable)
        return message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
              .setAuthor(
                `${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`${fail} Error Al Borrar`)
              .setDescription(`Por favor, asegúrese de que pueda ver ese canal.`)
              .setTimestamp()
              .setFooter({ text: "https://roxxy.es" })
              .setColor(message.guild.me.displayHexColor),
          ],
        });

      const member =
        message.mentions.members.first() ||
        getMemberFromMention(message, args[0]) ||
        message.guild.members.cache.get(args[0]);

      if (member) {
        args.shift();
      }

      const amount = parseInt(args[0]);
      if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
        return message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
              .setAuthor(
                `${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`${fail} Error Al Borrar`)
              .setDescription(`Solo puedo purgar entre 1 y 100 mensajes.`)
              .setTimestamp()
              .setFooter({ text: "https://roxxy.es" })
              .setColor(message.guild.me.displayHexColor),
          ],
        });

      if (!channel.permissionsFor(message.guild.me).has(["MANAGE_MESSAGES"]))
        return message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
              .setAuthor(
                `${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`${fail} Error Al Borrar`)
              .setDescription(
                `¡Asegúrate de tener el permiso **Gestionar mensajes**!`
              )
              .setTimestamp()
              .setFooter({ text: "https://roxxy.es" })
              .setColor(message.guild.me.displayHexColor),
          ],
        });

      let reason = args.slice(1).join(" ");
      if (!reason) reason = "Ninguna";
      if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

      await message.delete();

      let messages;
      if (member) {
        messages = (await channel.messages.fetch({ limit: amount })).filter(
          (m) => m.member.id === member.id
        );
      } else messages = amount;

      if (messages.size === 0) {
        message.channel
          .sendCustom(
            new MessageEmbed()
              .setDescription(
                `
            ${fail} No se puede encontrar ningún mensaje de ${member}. 
          `
              )
              .setColor(message.guild.me.displayHexColor)
          )
          .then((msg) => {
            setTimeout(() => {
              msg.delete();
            }, 10000);
          })
          .catch(() => {});
      } else {
        channel.bulkDelete(messages, true).then((messages) => {
          const embed = new MessageEmbed()

            .setDescription(
              `
            ${success} **${messages.size}** mensaje(s) eliminados correctamente ${
                logging && logging.moderation.include_reason === "true"
                  ? `\n\n**Razón:** ${reason}`
                  : ``
              }
          `
            )

            .setColor(message.guild.me.displayHexColor);

          if (member) {
            embed
              .spliceFields(1, 1, {
                name: "Mensajes Encontrados",
                value: `\`${messages.size}\``,
                inline: true,
              })
              .spliceFields(1, 0, {
                name: "Miembro",
                value: member,
                inline: true,
              });
          }

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
        });
      }

      const fields = {
        Channel: channel,
      };

      if (member) {
        fields["Miembro"] = member;
        fields["Mensajes"] = `\`${messages.size}\``;
      } else fields["Recuento De Mensajes"] = `\`${amount}\``;

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
                if (logging.moderation.purge == "true") {
                  let color = logging.moderation.color;
                  if (color == "#000000") color = message.client.color.red;

                  let logcase = logging.moderation.caseN;
                  if (!logcase) logcase = `1`;

                  const logEmbed = new MessageEmbed()
                    .setAuthor(
                      `Acción: \`Purge\` | Caso #${logcase}`,
                      message.author.displayAvatarURL({ format: "png" })
                    )
                    .addField("Moderador", `${message.member}`, true)
                    .setTimestamp()
                    .setFooter({ text: `ID Responsable: ${message.author.id}` })
                    .setColor(color);

                  for (const field in fields) {
                    logEmbed.addField(field, fields[field], true);
                  }

                  channel.send({ embeds: [logEmbed] }).catch(() => {});

                  logging.moderation.caseN = logcase + 1;
                  await logging.save().catch(() => {});
                }
              }
            }
          }
        }
      }
    } catch {
      return message.channel.sendCustom(
        `${message.client.emoji.fail} | No se pudieron purgar los mensajes`
      );
    }
  }
};

function getMemberFromMention(message, mention) {
  if (!mention) return;
  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) return;
  const id = matches[1];
  return message.guild.members.cache.get(id);
}

function getChannelFromMention(message, mention) {
  if (!mention) return;
  const matches = mention.match(/^<#(\d+)>$/);
  if (!matches) return;
  const id = matches[1];
  return message.guild.channels.cache.get(id);
}
