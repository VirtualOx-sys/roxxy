const Command = require("../../structures/Command");
const { exec } = require("child_process");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "exec",
      aliases: ["execute"],
      description: "Esto es para los desarrolladores.",
      category: "Owner",
      usage: ["<cosa-a-ejecutar>"],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    if (message.content.includes("config.json"))
      return message.channel.sendCustom(
        "Por motivos de privacidad, no podemos mostrar el archivo config.json."
      );

    if (args.length < 1)
      return message.channel.sendCustom(
        "¡Tienes que darme algún texto para ejecutar!"
      );

    exec(args.join(" "), (error, stdout) => {
      const response = stdout || error;
      message.channel.sendCustom(response);
    });
  }
};
