const Command = require("../../structures/Command");
const Maintenance = require("../../database/schemas/maintenance");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "maintenance",
      aliases: ["maintenance"],
      description: "Establece el bot en mantenimiento.",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    if (!args[0])
      return message.channel.sendCustom(
        "¿Le gustaría habilitar o deshabilitar el modo de mantenimiento?"
      );

    const maintenance = await Maintenance.findOne({
      maintenance: "maintenance",
    });

    if (args[0].toLowerCase() == "enable") {
      if (maintenance) {
        maintenance.toggle = "true";
        await maintenance.save();
      } else {
        const newMain = new Maintenance({
          toggle: "true",
        });
        newMain.save().catch(() => {});
      }
      message.channel.sendCustom("Modo de mantenimiento habilitado");
    } else if (args[0].toLowerCase() == "disable") {
      if (maintenance) {
        maintenance.toggle = "false";
        await maintenance.save();
      } else {
        const newMain = new Maintenance({
          toggle: "false",
        });
        newMain.save().catch(() => {});
      }
      message.channel.sendCustom("Modo de mantenimiento desactivado");
    } else {
      message.channel.sendCustom("Respuesta Invalida");
    }
  }
};
