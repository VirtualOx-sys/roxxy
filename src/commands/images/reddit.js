const Command = require("../../structures/Command");
const fetch = require("node-fetch");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "reddit",
      description: "Obtenga una foto aleatoria de subreddit especificado",
      category: "Imagenes",
      cooldown: 2,
    });
  }

  async run(message, args) {
    try {
      if (args.length < 1) {
        return message.channel.sendCustom("¡Por favor, dame un subreddit!");
      }

      var subreddits = [args.join(" ").split("").join("")];

      var reddit =
        subreddits[Math.round(Math.random() * (subreddits.length - 1))];

      const data = await fetch(
        `https://meme-api.herokuapp.com/gimme/${reddit}`
      ).then((res) => res.json());

      if (data.nsfw)
        return message.channel.sendCustom(
          `${message.client.emoji.fail} El subreddit seleccionado es 18+. ¡considere usar un canal NSFW!`
        );

      const { title, postLink, url, subreddit } = data;

      message.channel
        .sendCustom({
          embed: {
            color: message.client.config.blue,
            title: `${title}`,
            url: `${postLink}`,
            image: {
              url: url,
            },
            footer: { text: `/reddit/${subreddit}` },
          },
        })
        .catch(() => {
          message.channel.sendCustom(`¡No se pudo encontrar ese subreddit!`);
        });
    } catch (error) {
      message.channel.sendCustom(`¡No se pudo encontrar ese subreddit!`);
    }
  }
};
