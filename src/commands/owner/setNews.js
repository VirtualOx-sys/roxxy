const Command = require("../../structures/Command");
const NewsSchema = require("../../database/schemas/Pogy");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "setnews",
      description: "Esto es para los desarrolladores.",
      category: "Owner",
      usage: ["<texto>"],
      ownerOnly: true,
    });
  }

  async run(message, args) {
    let news = args.join(" ").split("").join("");
    if (!news) return message.channel.send("Por favor ingrese noticias.");
    const newsDB = await NewsSchema.findOne({});
    if (!newsDB) {
      await NewsSchema.create({
        news: news,
        time: new Date(),
      });

      return message.channel.send("Noticia Establecida.");
    }

    await NewsSchema.findOneAndUpdate(
      {},
      {
        news: news,
        time: new Date(),
      }
    );
  }
};
