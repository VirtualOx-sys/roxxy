const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild.js");
const Logging = require("../../database/schemas/logging.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "unlock",
      aliases: ["unlc"],
      description: "desbloquea el canal actual / mencionado.",
      category: "Moderacion",
      usage: "<canal> [tiempo]",
      examples: ["unlock #general"],
      guildOnly: true,
      botPermission: ["MANAGE_CHANNELS"],
      userPermission: ["MANAGE_CHANNELS"],
    });
  }

  async run(message, args) {
    const client = message.client;
    const fail = message.client.emoji.fail;
    const success = message.client.emoji.success;

    const logging = await Logging.findOne({ guildId: message.guild.id });
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    const language = require(`../../data/language/${guildDB.language}.json`);

    let channel = message.mentions.channels.first();
    let reason = args.join(" ") || "`ninguno`";

    let member = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "miembro"
    );
    let memberr = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "miembros"
    );
    let verified = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "verificado"
    );
    if (channel) {
      reason = args.join(" ").slice(22) || "`ninguno`";
    } else channel = message.channel;

    if (
      channel.permissionsFor(message.guild.id).has("SEND_MESSAGES") === true
    ) {
      const lockchannelError2 = new MessageEmbed()
        .setDescription(`${fail} | ${channel} ya esta desbloqueado`)
        .setColor(client.color.red);

      return message.channel.sendCustom(lockchannelError2);
    }

    channel.permissionOverwrites
      .edit(message.guild.me, { SEND_MESSAGES: true })
      .catch(() => {});

    channel.permissionOverwrites
      .edit(message.guild.id, { SEND_MESSAGES: true })
      .catch(() => {});

    channel.permissionOverwrites
      .edit(message.author.id, { SEND_MESSAGES: true })
      .catch(() => {});

    if (member) {
      channel.permissionOverwrites
        .edit(member, { SEND_MESSAGES: true })
        .catch(() => {});
    }

    if (memberr) {
      channel.permissionOverwrites
        .edit(memberr, { SEND_MESSAGES: true })
        .catch(() => {});
    }

    if (verified) {
      channel.permissionOverwrites
        .edit(verified, { SEND_MESSAGES: true })
        .catch(() => {});
    }

    const embed = new MessageEmbed()
      .setDescription(
        `${success} | Desbloqueado con éxito **${channel}** ${
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
              !role ||
              (role &&
                !message.member.roles.cache.find(
                  (r) => r.name.toLowerCase() === role.name
                ))
            ) {
              if (logging.moderation.lock == "true") {
                let color = logging.moderation.color;
                if (color == "#000000") color = message.client.color.green;

                let logcase = logging.moderation.caseN;
                if (!logcase) logcase = `1`;

                let reason = args.slice(1).join(" ");
                if (!reason) reason = `${language.noReasonProvided}`;
                if (reason.length > 1024)
                  reason = reason.slice(0, 1021) + "...";

                const logEmbed = new MessageEmbed()
                  .setAuthor(
                    `Acción: \`Desbloquear\` | ${message.author.tag} | Caso #${logcase}`,
                    message.author.displayAvatarURL({ format: "png" })
                  )
                  .addField("Canal", `${channel}`, true)
                  .addField("Moderador", `${message.member}`, true)
                  .addField("Razón", `${reason}`, true)
                  .setFooter({ text: `ID: ${message.author.id}` })
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
