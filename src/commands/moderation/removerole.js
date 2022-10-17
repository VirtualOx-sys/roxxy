const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "removerole",
      aliases: ["remrole"],
      description: "Elimina el rol especificado del usuario mencionado",
      category: "Moderacion",
      usage: "<usuario>",
      examples: ["removerole @VirtualOx"],
      guildOnly: true,
      botPermission: ["MANAGE_ROLES"],
      userPermission: ["MANAGE_ROLES"],
    });
  }

  async run(message, args) {
    const client = message.client;
    const fail = client.emoji.fail;
    const success = client.emoji.success;

    const logging = await Logging.findOne({ guildId: message.guild.id });

    let member =
      message.mentions.members.last() ||
      message.guild.members.cache.get(args[0]);

    if (!member)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(
              `${message.author.tag}`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`${fail} Error Al Remover El Rol`)
            .setDescription("Proporcione un rol válido")
            .setTimestamp()
            .setFooter({ text: "https://roxxy.es" })
            .setColor(message.guild.me.displayHexColor),
        ],
      });
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(
              `${message.author.tag}`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`${fail} Error Al Remover El Rol`)
            .setDescription("El usuario tiene un rol igual o superior.")
            .setTimestamp()
            .setFooter({ text: "https://roxxy.es" })
            .setColor(message.guild.me.displayHexColor),
        ],
      });

    const role =
      getRoleFromMention(message, args[1]) ||
      message.guild.roles.cache.get(args[1]) ||
      message.guild.roles.cache.find(
        (rl) => rl.name.toLowerCase() === args.slice(1).join(" ").toLowerCase()
      );

    let reason = `La característica actual no necesita razones`;
    if (!reason) reason = "Sin Motivo Proporcionado";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    if (!role)
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(
              `${message.author.tag}`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`${fail} Error Al Remover El Rol`)
            .setDescription("Proporcione un rol válido")
            .setTimestamp()
            .setFooter({ text: "https://roxxy.es" })
            .setColor(message.guild.me.displayHexColor),
        ],
      });
    else if (!member.roles.cache.has(role.id))
      return message.channel.sendCustom({
        embeds: [
          new MessageEmbed()
            .setAuthor(
              `${message.author.tag}`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`${fail} Error Al Remover El Rol`)
            .setDescription(`El usuario proporcionado no tiene el rol.`)
            .setTimestamp()
            .setFooter({ text: "https://roxxy.es" })
            .setColor(message.guild.me.displayHexColor),
        ],
      });
    else {
      try {
        await member.roles.remove(role, [
          `Eliminación de Rol / Usuario Responsable: ${message.author.tag}`,
        ]);
        const embed = new MessageEmbed()

          .setDescription(
            ` ${success} | Se eliminó **${role.name}** de **${member.user.tag}**`
          )
          .setColor(message.guild.me.displayHexColor);
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
                  if (logging.moderation.role == "true") {
                    let color = logging.moderation.color;
                    if (color == "#000000") color = message.client.c;

                    let logcase = logging.moderation.caseN;
                    if (!logcase) logcase = `1`;

                    const logEmbed = new MessageEmbed()
                      .setAuthor(
                        `Acción: \`Quitar Rol\` | ${member.user.tag} | Caso #${logcase}`,
                        member.user.displayAvatarURL({ format: "png" })
                      )
                      .addField("Usuario", `${member}`, true)
                      .addField("Moderador", `${message.member}`, true)
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
      } catch (err) {
        message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
              .setAuthor(
                `${message.author.tag}`,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTitle(`${fail} Error Al Remover El Rol`)
              .setDescription(
                `No se puede eliminar el rol del usuario, verifique la jerarquía de roles y asegúrese de que mi rol esté por encima del usuario proporcionado.`
              )
              .setTimestamp()
              .setFooter({ text: "https://roxxy.es" })
              .setColor(message.guild.me.displayHexColor),
          ],
        });
      }
    }
  }
};
function getRoleFromMention(message, mention) {
  if (!mention) return;
  const matches = mention.match(/^<@&(\d+)>$/);
  if (!matches) return;
  const id = matches[1];
  return message.guild.roles.cache.get(id);
}
