const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild.js");

const Logging = require("../../database/schemas/logging.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "unban",
      aliases: ["ub", "uban"],
      description: "desbanear al usuario especificado del servidor",
      category: "Moderacion",
      usage: "<ID-usuario>",
      examples: ["unban  429815351774281748"],
      guildOnly: true,
      botPermission: ["BAN_MEMBERS"],
      userPermission: ["BAN_MEMBERS"],
    });
  }

  async run(message, args) {
    let client = message.client;

    const logging = await Logging.findOne({ guildId: message.guild.id });

    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    const language = require(`../../data/language/${guildDB.language}.json`);

    const rgx = /^(?:<@!?)?(\d+)>?$/;

    const id = args[0];
    if (!id) {
      const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(
          `**Uso Adecuado:**\n\n\`1-\` unban VirtualOx#0123 apeló\n\`2-\` unban 429815351774281748 apeló\n\`3-\` unban all`
        )
        .setColor(message.client.color.red)
        .setFooter({ text: "https://roxxy.es" });

      message.channel.sendCustom({ embeds: [embed] });
      return;
    }

    if (id.toString().toLowerCase() == "all") {
      const users = await message.guild.members.unban(ban.user.id);
      const array = [];

      let reason = `Desbanear a todos`;

      for (const user of users.array()) {
        await message.guild.members.unban(
          user.user,
          `${reason} / ${language.unbanResponsible}: ${message.author.tag}`
        );
        array.push(user.user.tag);
      }

      if (!array || !array.length) {
        const embed = new MessageEmbed()
          .setDescription(
            `${client.emoji.fail} | El servidor actual no tiene usuarios prohibidos.`
          )
          .setColor(client.color.green);

        message.channel.sendCustom({ embeds: [embed] }).catch(() => {});
      } else {
        const embed = new MessageEmbed()
          .setDescription(
            `${client.emoji.success} | ${language.unbanSuccess} **${
              array.length
            }** Usuarios Del Servidor \n\n**Usuarios:**\n${array.join(" - ")} ${
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
                if (logging.moderation.ban == "true") {
                  let color = logging.moderation.color;
                  if (color == "#000000") color = message.client.color.yellow;

                  let logcase = logging.moderation.caseN;
                  if (!logcase) logcase = `1`;

                  let bannedUsersLength = `${array.length} usuarios`;
                  if (!array || !array.length) bannedUsersLength = "Sin usuarios";
                  if (array.length === 1) bannedUsersLength = "1 Usuario";
                  const logEmbed = new MessageEmbed()
                    .setAuthor(
                      `Acción: \`UnBan All\` | ${bannedUsersLength} | Caso #${logcase}`,
                      message.author.displayAvatarURL({ format: "png" })
                    )
                    .addField("Usuarios no baneados", `${bannedUsersLength}`, true)
                    .addField("Moderador", `${message.member}`, true)
                    .setTimestamp()
                    .setColor(color);

                  if (array.length)
                    logEmbed.addField("**Usuarios:**", array.join(" - "));
                  channel.send({ embeds: [logEmbed] }).catch(() => {});

                  logging.moderation.caseN = logcase + 1;
                  await logging.save().catch(() => {});
                }
              }
            }
          }
        }
      }
    } else {
      if (!rgx.test(id)) {
        let members = client.users.cache
          .filter((user) => user.tag === args[0])
          .map((user) => user.id)
          .toString();

        const bannedUsers1 = await message.guild.members.unban(ban.user.id);
        const user1 = bannedUsers1.get(members);

        if (user1) {
          let reason = args.slice(1).join(" ");
          if (!reason) reason = language.unbanNoReason;
          if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

          const userrz = bannedUsers1.get(members).user;
          if (userrz) {
            const embed = new MessageEmbed()
              .setDescription(
                `${client.emoji.success} | ${language.unbanSuccess} ${
                  userrz.tag
                } ${
                  logging && logging.moderation.include_reason === "true"
                    ? `\n\n**Razón:** ${reason}`
                    : ``
                }`
              )
              .setColor(client.color.green);

            message.channel.sendCustom({ embeds: [embed] }).catch(() => {});
            await message.guild.members
              .unban(
                userrz,
                `${reason} / ${language.unbanResponsible}: ${message.author.tag}`
              )
              .then(async (s) => {
                if (logging && logging.moderation.delete_reply === "true") {
                  setTimeout(() => {
                    s.delete().catch(() => {});
                  }, 5000);
                }
              })
              .catch(() => {});

            //log
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
                  if (
                    message.channel.id !== logging.moderation.ignore_channel
                  ) {
                    if (
                      !message.member.roles.cache.find(
                        (r) => r.name.toLowerCase() === role.name
                      )
                    ) {
                      if (logging.moderation.ban == "true") {
                        let color = logging.moderation.color;
                        if (color == "#000000")
                          color = message.guild.me.displayHexColor;

                        let logcase = logging.moderation.caseN;
                        if (!logcase) logcase = `1`;

                        let reason = args.slice(1).join(" ");
                        if (!reason) reason = `${language.noReasonProvided}`;
                        if (reason.length > 1024)
                          reason = reason.slice(0, 1021) + "...";

                        const logEmbed = new MessageEmbed()
                          .setAuthor(
                            `Acción: \`UnBan\` | ${userrz.tag} | Caso #${logcase}`,
                            userrz.displayAvatarURL({ format: "png" })
                          )
                          .addField("Usuario", `${userrz}`, true)
                          .addField("Moderador", `${message.member}`, true)
                          .setFooter({ text: `ID: ${userrz.id}` })
                          .setTimestamp()
                          .setColor(color);

                        channel.send({ embeds: [logEmbed] }).catch((e) => {
                          console.log(e);
                        });

                        logging.moderation.caseN = logcase + 1;
                        await logging.save().catch(() => {});
                      }
                    }
                  }
                }
              }
            }
          } else {
            message.channel.sendCustom({
              embeds: [
                new MessageEmbed()
                  .setDescription(
                    `${client.emoji.fail} | ${language.unbanInvalidID}`
                  )
                  .setColor(client.color.red),
              ],
            });
          }
        } else {
          message.channel.sendCustom({
            embeds: [
              new MessageEmbed()
                .setDescription(
                  `${client.emoji.fail} | ${language.unbanInvalidID}`
                )
                .setColor(client.color.red),
            ],
          });
        }

        return;
      }

      const bannedUsers = await message.guild.members.unban(ban.user.id);
      const user = bannedUsers.get(id);
      if (!user)
        return message.channel.sendCustom({
          embeds: [
            new MessageEmbed()
              .setDescription(
                `${client.emoji.fail} | ${language.unbanInvalidID}`
              )
              .setColor(client.color.red),
          ],
        });

      let reason = args.slice(1).join(" ");
      if (!reason) reason = language.unbanNoReason;
      if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

      const userr = bannedUsers.get(id).user;
      await message.guild.members.unban(
        user.user,
        `${reason} / ${language.unbanResponsible}: ${message.author.tag}`
      );

      const embed = new MessageEmbed()
        .setDescription(
          `${client.emoji.success} | ${language.unbanSuccess} ${userr.tag} ${
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
                !message.member.roles.cache.find(
                  (r) => r.name.toLowerCase() === role.name
                )
              ) {
                if (logging.moderation.ban == "true") {
                  let color = logging.moderation.color;
                  if (color == "#000000")
                    color = message.guild.me.displayHexColor;

                  let logcase = logging.moderation.caseN;
                  if (!logcase) logcase = `1`;

                  let reason = args.slice(1).join(" ");
                  if (!reason) reason = `${language.noReasonProvided}`;
                  if (reason.length > 1024)
                    reason = reason.slice(0, 1021) + "...";

                  const logEmbed = new MessageEmbed()
                    .setAuthor(
                      `Acción: \`UnBan\` | ${userr.tag} | Caso #${logcase}`,
                      userr.displayAvatarURL({ format: "png" })
                    )
                    .addField("Usuario", `${userr}`, true)
                    .addField("Moderador", `${message.member}`, true)
                    .setFooter({ text: `ID: ${userr.id}` })
                    .setTimestamp()
                    .setColor(color);

                  channel.send({ embeds: [logEmbed] }).catch((e) => {
                    console.log(e);
                  });

                  logging.moderation.caseN = logcase + 1;
                  await logging.save().catch(() => {});
                }
              }
            }
          }
        }
      }
    }
  }
};
