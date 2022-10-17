const Event = require("../../structures/Event");

module.exports = class extends Event {
  async run(error, message) {
    console.log(error);

    message.channel.sendCustom(`Se ha producido un error de API, inténtelo de nuevo más tarde.`);
  }
};
