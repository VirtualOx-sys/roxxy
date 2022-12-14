const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "restart",
      aliases: ["reboot"],
      description: "┬íReinicia el bot!",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message) {
    await message.channel
      .sendCustom("┬íReiniciando!")
      .catch((err) => this.client.console.error(err));
    process.exit(1);
  }
};
