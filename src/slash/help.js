module.exports = {
  name: "help",
  description: "¡Muestra los comandos del bot!",
  category: "general",
  slash: "true",
  global: true,
  error: async () => {},
  run: async (data) => {
    data.interaction.editReply({
      content: `Todavía estamos trabajando en nuestros comandos de barra, ¡vuelve más tarde!`,
    });
  },
};
