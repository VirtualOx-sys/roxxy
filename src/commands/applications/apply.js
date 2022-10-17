const discord = require("discord.js");
const Command = require("../../structures/Command");
const Guild = require("../../database/schemas/Guild");
const app = require("../../database/models/application/application.js");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "apply",
      aliases: [],
      usage: "",
      category: "Aplicaciones",
      examples: ["apply"],
      description: "Aplique en los servidores actuales, o responda algunas preguntas",
      cooldown: 5,
    });
  }

  async run(message) {
    const guildDB = await Guild.findOne({
      guildId: message.guild.id,
    });
    const language = require(`../../data/language/${guildDB.language}.json`);
    const closed = new discord.MessageEmbed()
      .setDescription(
        `${message.client.emoji.fail} | ${language.closedapplay1} `
      )
      .setColor(message.client.color.red);

    const closed2 = new discord.MessageEmbed()
      .setDescription(
        `${message.client.emoji.fail} | ${language.closedapplay2}.`
      )
      .setColor(message.client.color.red);

    let db = await app.findOne({
      guildID: message.guild.id,
    });

    if (!db) {
      let newAppDB = new app({
        guildID: message.guild.id,
        questions: [],
        appToggle: false,
        appLogs: null,
      });
      await newAppDB.save().catch((err) => {
        console.log(err);
      });

      return message.channel.sendCustom(closed);
    }

    if (db.questions.length === 0 || db.questions.length < 1)
      return message.channel.sendCustom(closed);
    const channel = await message.guild.channels.cache.get(db.appLogs);
    if (!channel) return message.channel.sendCustom(closed);
    await message.author
      .send({
        embeds: [
          new discord.MessageEmbed()
            .setColor(message.client.color.green)
            .setFooter({ text: "Motorizado Por Roxxy.es" })
            .setDescription(
              `${message.client.emoji.success} | ${language.applaydone} **${message.guild.name}** [haciendo clic aquí
](https://roxxy.es/apply/${message.guild.id})`
            ),
        ],
      })
      .then(message.channel.sendCustom(`Formulario enviado por DM - ${message.author}`))
      .catch(() => {
        return message.channel.sendCustom(closed2);
      });
  }
};
