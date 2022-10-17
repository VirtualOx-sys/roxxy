const Command = require("../../structures/Command");
const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "fetchinvite",
      aliases: ["finvite", "finv"],
      description: "¡Busca una invitación!",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return message.channel.sendCustom(`Proporciona un servidor`);
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return message.channel.sendCustom(`ID de servidor no válido`);

    var textChats = guild.channels.cache.find(
      (ch) =>
        ch.type === "GUILD_TEXT" &&
        ch.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE")
    );

    if (!textChats) message.channel.sendCustom(`Sin canal`);

    await textChats
      .createInvite({
        maxAge: 0,
        maxUses: 0,
      })
      .then((inv) => {
        console.log(`${guild.name} | ${inv.url}`);
        message.channel.sendCustom(`${guild.name} | ${inv.url}`);
      })
      .catch(() => {
        message.channel.sendCustom("No tengo permiso");
      });
  }
};
