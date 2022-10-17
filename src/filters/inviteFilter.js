const Guild = require("../database/schemas/Guild");
const fetch = require("node-fetch");

module.exports = async (message) => {
  const settings = await Guild.findOne({
    guildId: message.guild.id,
  });
  if (settings.antiLinks) return;
  if (settings.antiInvites) {
    if (
      !message.member.permissions.has(
        "ADMINISTRATOR" ||
          "MANAGE_GUILD" ||
          "BAN_MEMBERS" ||
          "KICK_MEMBERS" ||
          "MANAGE_MESSAGES"
      )
    ) {
      const inviteLink = new RegExp(
        /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g
      );
      if (inviteLink.test(message.content)) {
        const msgcontent = message.content;
        const code = msgcontent.replace(
          /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/?/g,
          ""
        );
        fetch(`https://discordapp.com/api/invite/${code}`)
          .then((res) => res.json())
          .then((json) => {
            if (json.message !== "Invitación Desconocida") {
              message.delete().catch(() => {});
              message.channel.sendCustom({
                embed: {
                  color: "RED",
                  author: {
                    name: `${message.member.user.tag}`,
                    icon_url: message.member.user.displayAvatarURL({
                      format: "png",
                      dynamic: true,
                      size: 1024,
                    }),
                  },
                  footer: {
                    text: message.deletable
                      ? ""
                      : "No se pudo eliminar el mensaje debido a la falta de permisos.",
                  },
                  description: "No hay enlaces de invitación aquí",
                },
              });
            }
          });
      } else {
        let links = message.content.match(
          /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i
        );
        if (links) {
          message.delete().catch(() => {});
          message.channel.sendCustom({
            embed: {
              color: "RED",
              author: {
                name: `${message.member.user.tag}`,
                icon_url: message.member.user.displayAvatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024,
                }),
              },
              footer: {
                text: message.deletable
                  ? ""
                  : "No se pudo eliminar el mensaje debido a la falta de permisos.",
              },
              description: "No hay enlaces de invitación aquí",
            },
          });
        }
      }
    }
  }
};
