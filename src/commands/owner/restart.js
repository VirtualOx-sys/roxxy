const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "restart",
      aliases: ["reboot"],
      description: "¡Reinicia el bot!",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message) {
    await message.channel
      .sendCustom("¡Reiniciando!")
      .catch((err) => this.client.console.error(err));
    process.exit(1);
  }
};
