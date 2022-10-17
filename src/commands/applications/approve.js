const discord = require("discord.js");
const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const App = require("../../database/models/application/application.js");
const Paste = require("../../database/models/transcript.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "approveapp",
      aliases: ["approveapplication", "approveapplication", "approveform"],
      usage: "<usuario> <appID> <razón>",
      category: "Aplicaciones",
      examples: ["approve @VirtualOx Razón Aquí"],
      description: "Aprobar una solicitud en el servidor.",
      cooldown: 5,
      userPermission: ["MANAGE_GUILD"],
      botPermission: ["MANAGE_ROLES"],
    });
  }
  async run(message, args) {
    const client = message.client;
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    const language = require(`../../data/language/${guildDB.language}.json`);

    if (guildDB.isPremium === "false") {
      message.channel.sendCustom({
        embeds: [
          new discord.MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setDescription(
              `${message.client.emoji.fail} | ${language.approvepremium}.\n\n[Consulta el premium aquí](https://roxxy.es/premium)`
            ),
        ],
      });

      return;
    }
    let app = await App.findOne({
      guildID: message.guild.id,
    });

    if (!app) {
      app = new App({
        guildID: message.guild.id,
      });

      await app.save();
      app = await App.findOne({
        guildID: message.guild.id,
      });
    }
    let member = message.mentions.members.last();

    if (!member) {
      try {
        member = await message.guild.members.fetch(args[0]);
      } catch {
        member = message.member;
      }
    }

    if (!member)
      return message.channel.sendCustom(
        `${client.emoji.fail} | ${language.approveerrormember}.`
      );

    const id = args[1];
    const paste = await Paste.findOne({
      type: "form",
      by: member.id,
      _id: args[1],
    });

    if (!paste)
      return message.channel.sendCustom(
        `${client.emoji.fail} | ${language.approvenotfound}.`
      );

    let reason = args.slice(2).join(" ");
    if (!reason) reason = `${language.noReasonProvided}`;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    if (paste.status === "approved")
      return message.channel.sendCustom(
        `${client.emoji.fail} | ${language.approveapplicationapproved}`
      );
    if (paste.status === "declined")
      return message.channel.sendCustom(
        `${client.emoji.fail} | ${language.approveapplicationdeclined}`
      );

    (paste.status = "approved"), await paste.save().catch(() => {});

    const add_role = message.guild.roles.cache.get(app.add_role);
    if (add_role) {
      await member.roles.add(add_role).catch(() => {});
    }
    message.channel.sendCustom({
      embeds: [
        new discord.MessageEmbed()
          .setColor(message.client.color.green)
          .setTitle(language.approveapplicationdoneapprovedtitle)
          .setDescription(
            `${client.emoji.success} | ${language.approveapplicationdoneapproveddescription} ${id}\n**Aprobado por:** ${message.author.tag}\n**Razón:** ${reason}`
          ),
      ],
    });
    if (app.dm === true) {
      member
        .send({
          embeds: [
            new discord.MessageEmbed()
              .setColor(message.client.color.green)
              .setTitle(language.approveapplicationdonetitle)
              .setDescription(
                `${client.emoji.success} | Oye ${member.user.tag}, ${language.approveapplicationdonemember} ${id}\n**Aprobado por:** ${message.author.tag}\n**Razón:** ${reason}`
              ),
          ],
        })
        .catch(() => {
          message.channel.sendCustom(
            `No importa... Pude aprobar la aplicación, pero no pude enviar mensaje directo a ${member.user.tag} porque sus mensajes directos están cerrados.'`
          );
        });
    }
  }
};
