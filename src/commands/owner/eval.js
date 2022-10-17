const Command = require("../../structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "eval",
      aliases: ["ev"],
      description: "Esto es para los desarrolladores.",
      category: "Owner",
      usage: ["<cosa-a-evaluar>"],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const input = args.join(" ");
    if (!input) return message.channel.sendCustom(`¿Qué evalúo?`);
    if (!input.toLowerCase().includes("token")) {
      let embed = ``;

      try {
        let output = eval(input);
        if (typeof output !== "string")
          output = require("util").inspect(output, { depth: 0 });

        embed = `\`\`\`js\n${
          output.length > 1024 ? "Demasiado grande para mostrar." : output
        }\`\`\``;
      } catch (err) {
        embed = `\`\`\`js\n${
          err.length > 1024 ? "Demasiado grande para mostrar." : err
        }\`\`\``;
      }

      message.channel.sendCustom(embed);
    } else {
      message.channel.sendCustom("Bruh, ¿intentas robar mi token, eh?");
    }
  }
};
