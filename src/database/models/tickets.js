const mongoose = require("mongoose");

let ticketSchema = mongoose.Schema({
  guildID: { type: String },
  ticketReactChannel: { type: String },
  messageID: { type: Array, default: [] },
  supportRoleID: { type: String },
  categoryID: { type: String },
  ticketModlogID: { type: String },
  ticketType: { type: String, default: "" },
  ticketCase: {
    type: mongoose.SchemaTypes.Number,
    default: "1",
  },
  maxTicket: {
    type: Number,
    default: "1",
  },
  ticketToggle: { type: String, default: false },
  ticketWelcomeMessage: {
    type: String,
    default: `¡Oye {user} Bienvenido a tu ticket!\n\nGracias por crear un ticket, el equipo de soporte estará contigo en breve.\n\nMientras tanto, explique su problema a continuación`,
  },
  ticketPing: { type: String, default: false },
  ticketClose: { type: String, default: false },
  ticketTimestamp: { type: String, default: false },
  ticketLogColor: { type: String, default: `#000000` },
  ticketEmbedColor: { type: String, default: `#000000` },
  ticketTitle: { type: String, default: `Tickets Del Servidor` },
  ticketDescription: {
    type: String,
    default: `¡Reacciona con 🎫 para abrir un ticket!`,
  },
  ticketFooter: { type: String, default: `Motorizado Por Roxxy.es` },
  ticketReaction: { type: String, default: `🎫` },
  ticketWelcomeColor: { type: String, default: `#000000` },
  requireReason: { type: String, default: true },
  ticketCustom: { type: String, default: "false" },
});

module.exports = mongoose.model("ticketSchema", ticketSchema);
