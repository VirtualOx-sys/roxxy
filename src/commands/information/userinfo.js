const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../database/schemas/Guild");
const User = require("../../database/schemas/User");
const Nickname = require("../../database/schemas/nicknames");

const Usernames = require("../../database/schemas/usernames");
const moment = require("moment");
moment.locale('es');
const emojis = require("../../assets/emojis.json");

const flags = {
  DISCORD_EMPLOYEE: `${emojis.discord_employee} \`Empleado De Discord\``,
  DISCORD_PARTNER: `${emojis.discord_partner} \`Propietario Del Servidor Asociado\``,
  BUGHUNTER_LEVEL_1: `${emojis.bughunter_level_1} \`Bug Hunter (Nivel 1)\``,
  BUGHUNTER_LEVEL_2: `${emojis.bughunter_level_2} \`Bug Hunter (Nivel 2)\``,
  HYPESQUAD_EVENTS: `${emojis.hypesquad_events} \`Eventos Del HypeSquad\``,
  HOUSE_BRAVERY: `${emojis.house_bravery} \`Bravery Del HypeSquad\``,
  HOUSE_BRILLIANCE: `${emojis.house_brilliance} \`Brilliance Del HypeSquad\``,
  HOUSE_BALANCE: `${emojis.house_balance} \`Balance Del HypeSquad\``,
  EARLY_SUPPORTER: `${emojis.early_supporter} \`Primeros Partidarios\``,
  TEAM_USER: "Usuario Del Equipo",
  SYSTEM: "Sistema",
  VERIFIED_BOT: `${emojis.verified_bot} \`Bot Verificado\``,
  VERIFIED_DEVELOPER: `${emojis.verified_developer} \`Desarrollador Inicial De Bots Verificado\``,
};

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "userinfo",
      aliases: ["ui", "user", "whois"],
      description: "Muestra información sobre un usuario proporcionado.",
      category: "Informacion",
      usage: "[usuario]",
      examples: ["userinfo", "userinfo 429815351774281748"],
      guildOnly: true,
      cooldown: 3,
    });
  }

  async run(message, args) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });

    const language = require(`../../data/language/${guildDB.language}.json`);

    let member = message.mentions.members.last() || message.member;

    if (!member) {
      try {
        member = await message.guild.members.fetch(args[0]);
      } catch {
        member = message.member;
      }
    }

    if(!member.user) return message.channel.send(language.userinfo.no_user);

    let userFind = await User.findOne({
      discordId: member.id,
    });

    if (!userFind) {
      const newUser = new User({
        discordId: member.id,
      });

      newUser.save();
      userFind = await User.findOne({
        discordId: member.id,
      });
    }
    let badge;
    if (userFind && userFind.badges) {
      badge = userFind.badges.join(" ");
      if (!badge || !badge.length) badge = `\`Ninguna\``;
    } else {
      badge = `\`Ninguna\``;
    }

    let usernames = [];

    // user  tags
    let userName = await Usernames.findOne({
      discordId: member.id,
    });
    if (!userName) {
      const newUser = new Usernames({
        discordId: member.id,
      });

      newUser.save();

      usernames = `Sin Etiquetas Rastreadas`;
    } else {
      usernames = userName.usernames.join(" - ");
      if (!userName.usernames.length) usernames = `Sin Etiquetas Rastreadas`;
    }

    let nickname = [];

    // user nicknames
    const nicknames = await Nickname.findOne({
      discordId: member.id,
      guildId: message.guild.id,
    });
    if (!nicknames) {
      const newUser = new Nickname({
        discordId: member.id,
        guildId: message.guild.id,
      });

      newUser.save();

      nickname = `Ningún Apodo Rastreado`;
    } else {
      nickname = nicknames.nicknames.join(" - ");
      if (!nicknames.nicknames.length) nickname = `Ningún Apodo Rastreado`;
    }

    const userFlags = (await member.user.fetchFlags()).toArray();

    // Trim roles
    let rolesNoob;
    let roles = member.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);

    rolesNoob = roles.join(" ");
    if (member.roles.cache.size < 1) rolesNoob = "Sin Roles";

    if (!member.roles.cache.size || member.roles.cache.size - 1 < 1)
      roles = `\`Ninguno\``;
    const embed = new MessageEmbed()

      .setAuthor(
        `${member.user.tag}`,
        member.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp()
      .setColor(member.displayHexColor)
      .setDescription(
        `**• ${language.userh}** \`${member.user.username}\` | \`#${
          member.user.discriminator
        }\`\n** • ID:** \`${member.id}\`\n**• ${
          language.joinedDiscord
        }** \`${moment(member.user.createdAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        )}\`\n**• ${language.joinedServer}** \`${moment(member.joinedAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        )}\`\n**• Roles [${roles.length || "0"}]: ** ${
          rolesNoob || `\`${language.noRoles}\``
        }\n\n**• ${language.badgeslmao}** ${
          userFlags.map((flag) => flags[flag]).join("\n") ||
          `\`${language.noBadge}\``
        }\n**• ${language.botBadges}** ${
          badge || `\`Ninguna\``
        }\n**• Últimos 5 Apodos:**\n\`\`\`${
          nickname || `Ningún Apodo Rastreado`
        }\`\`\`**• Últimas 5 Etiquetas:**\n\`\`\`${
          usernames || `Sin Etiquetas Rastreadas`
        }\`\`\` `
      );

    message.channel.sendCustom({ embeds: [embed] });
  }
};
