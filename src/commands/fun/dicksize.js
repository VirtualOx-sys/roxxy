const Command = require("../../structures/Command");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "dicksize",
      aliases: ["ds", "pp", "ppsize"],
      description: "Muestra su tamaño de PP",
      category: "Diversion",
      cooldown: 3,
    });
  }

  async run(message) {
    let user = message.mentions.users.first();
    if (!user) {
      user = message.author;
    }
    const size = (user.id.slice(-3) % 20) + 1;
    const sizee = size / 2.54;
    await message.channel.sendCustom({
      embed: {
        color: "BLURPLE",
        description: `${sizee.toFixed(2)} inch\n8${"=".repeat(size)}D`,
      },
    });
  }
};
