const discord = require("discord.js");
const ticketSchema = require("../../database/models/tickets.js");
const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "trem",
      aliases: ["ticketrem", "tremove", "ticketremove"],
      description: "Elimina a un miembro del ticket actual",
      usage: "<usuario>",
      category: "Tickets",
    });
  }

  async run(message, args) {
    const client = message.client;
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    const language = require(`../../data/language/${guildDB.language}.json`);

    let userToMention =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!userToMention)
      return message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(client.color.red)
            .setDescription(language.addNotSpecifyUser),
        ],
      });

    await ticketSchema.findOne(
      {
        guildID: message.guild.id,
      },
      async (err, db) => {
        if (!db) return;

        try {
          let ticketRole = message.guild.roles.cache.get(db.supportRoleID);

          if (!message.member.roles.cache.has(ticketRole.id))
            return message.channel.sendCustom({
              embeds: [
                new discord.MessageEmbed()
                  .setColor(client.color.red)
                  .setDescription(
                    language.claimNotHaveRole.replace(
                      "{roleName}",
                      ticketRole.name
                    )
                  ),
              ],
            });

          if (!message.channel.name.startsWith("ticket-"))
            return message.channel.sendCustom({
              embeds: [
                new discord.MessageEmbed()
                  .setColor(client.color.red)
                  .setDescription(language.addNotValidChannel),
              ],
            });

          let pogy = message.guild.me;
          let everyone = message.guild.roles.everyone;
          let author = message.author;

          message.channel.permissionOverwrites.edit(pogy, {
            VIEW_CHANNEL: true,

            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            ATTACH_FILES: true,
          });

          message.channel.permissionOverwrites.edit(everyone, {
            VIEW_CHANNEL: false,
          });

          message.channel.permissionOverwrites.edit(author, {
            VIEW_CHANNEL: true,

            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
            ATTACH_FILES: true,
          });

          message.channel.permissionOverwrites.edit(userToMention.id, {
            VIEW_CHANNEL: null,
            READ_MESSAGES: null,
            SEND_MESSAGES: null,
            READ_MESSAGE_HISTORY: null,
            ATTACH_FILES: null,
          });

          if (ticketRole) {
            message.channel.permissionOverwrites.edit(ticketRole, {
              VIEW_CHANNEL: true,

              SEND_MESSAGES: true,
              READ_MESSAGE_HISTORY: true,
              ATTACH_FILES: true,
            });
          }

          message.react(client.emoji.check);
        } catch (e) {
          message.channel.sendCustom(
            `Ha ocurrido un error: ${e}\nEnv??a esto en el servidor de soporte.`
          );
        }
      }
    );
  }
};
