const { Client, Collection } = require("discord.js");
const Util = require("./src/structures/Util");
const config = require("./config.json");
const { status } = config;

module.exports = class PogyClient extends Client {
  constructor(options = {}) {
    super({
      partials: ["MESSAGE", "CHANNEL", "REACTION", "GUILD_MEMBER", "USER"],
      intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_MESSAGES",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
      ],
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: true,
      },
      presence: {
        status: "online",
        activities: [
          {
            type: "WATCHING",
            name: status,
          },
        ],
      },
    });

    this.validate(options);
    this.botCommands = new Collection();
    this.botEvents = new Collection();
    this.aliases = new Collection();
    this.utils = require("./src/utils/utils.js");
    this.mongoose = require("./src/utils/mongoose");
    this.utils = new Util(this);
    this.config = require("./config.json");
  }

  validate(options) {
    if (typeof options !== "object")
      throw new TypeError("Las opciones deben ser un tipo de objeto.");

    if (!options.prefix)
      throw new Error("Debe pasar un prefijo para el cliente.");
    if (typeof options.prefix !== "string")
      throw new TypeError("El prefijo debe ser un tipo de Cadena.");
    this.prefix = options.prefix;
  }

  async start(token) {
    require("./src/utils/prototypes");
    await this.utils.loadCommands();
    await this.utils.loadEvents();
    await this.mongoose.init();
    this.login(token);
  }
};
