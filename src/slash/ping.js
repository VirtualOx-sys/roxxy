module.exports = {
  name: "ping",
  description: "¡Obtén el ping de la API del bot!",
  category: "general",
  slash: "true",
  global: true,
  error: async () => {},
  run: async (data) => {
    data.interaction.editReply({
      content: `Ping de la API: \`${Math.floor(
        data.interaction.client.ws.ping
      )} ms\``,
    });
  },
};
