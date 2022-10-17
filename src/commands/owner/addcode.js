const Command = require("../../structures/Command");
const Premium = require("../../database/schemas/GuildPremium");
const discord = require("discord.js");
const moment = require("moment");
moment.locale('es');

var voucher_codes = require("voucher-code-generator");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "addpremium",
      aliases: ["apremium"],
      description: "Añade un código premium.",
      category: "Owner",
      ownerOnly: true,
    });
  }

  async run(message, args) {
    const plans = ["mensual", "anual"];

    if (!args[0])
      return message.channel.sendCustom(
        `¡Proporcione un plan!\n${plans.join(" - ")}`
      );

    if (!plans.includes(args[0]))
      return message.channel.sendCustom(
        `¡Proporcione un plan!\n${plans.join(" - ")}`
      );

    let expiresAt;

    if (args[0] === "mensual") {
      expiresAt = Date.now() + 2592000000;
    } else if (args[0] === "anual") {
      expiresAt = Date.now() + 2592000000 * 12;
    }

    let amount = args[1];
    if (!amount) amount = 1;

    const array = [];
    for (var i = 0; i < amount; i++) {
      const codePremium = voucher_codes.generate({
        pattern: "####-####-####",
      });

      const code = codePremium.toString().toUpperCase();

      const find = await Premium.findOne({
        code: code,
      });

      if (!find) {
        Premium.create({
          code: code,
          expiresAt: expiresAt,
          plan: args[0],
        });

        array.push(`\`${i + 1}-\` ${code}`);
      }
    }

    message.channel.sendCustom({
      embeds: [
        new discord.MessageEmbed()
          .setColor(message.client.color.green)
          .setDescription(
            `**Código(s) premium ${array.length} generados**\n\n${array.join(
              "\n"
            )}\n\n**Tipo:** ${args[0]}\n**Caduca:** ${moment(expiresAt).format(
              "dddd, MMMM Do YYYY"
            )}`
          ),
      ],
    });
  }
};
