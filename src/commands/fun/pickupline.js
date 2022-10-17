const Command = require("../../structures/Command");

const line = [
  "¿Eres Node.js porque siempre te devolvería la llamada? Lo prometo", 
  "¡Espero que sepas resucitación cardiopulmonar porque me quitas el aliento!",
  "Me has puesto tan nervioso que he olvidado por completo mi línea de recogida estándar", 
  "¿Eres una carta trampa? Porque me he enamorado de ti", 
  "Las rosas son rojas, las violetas son azules, omae wa mo shindeiru", 
  "Bebé, ven conmigo y estarás Going Merry",
  "¡Creo que necesito una cura paralizante! ¡Porque eres deslumbrante!", 
  "¡Debes ser un mahou shoujo, me tienes bajo tu hechizo!", 
  "¿Tienes un Death Note? ¡Porque cada vez que sonríes, siento que me está dando un infarto!",
  "¿Eres Saitama? ¡Porque me derribaste con un solo movimiento!", 
  "¡No necesito 99 almas, todo lo que necesito es la tuya!", 
  "Debes ser mejor que Kuuhaku. ¡Porque cuando te vi por primera vez, ya te ganaste mi corazón!", 
  "¡Tomaría el examen Hunter solo por ti!",
  "¿Crees en el destino? ¿Qué tal si te quedas a pasar la noche? (Fate/Night; este no era demasiado aparente...)",
  "¡Solo di que sí y te daré más de siete Eurekas!",
  "Eres como el equipo de maniobra 3D. ¡No tendré ninguna oportunidad en este mundo sin ti!", 
  "Me recuerdas a Menma. ¡Porque incluso cuando no puedo verte, todavía te siento dentro de mi corazón!", 
  "¡Si tuviera un Geass, te ordenaría que fueras mío!",
  "Estudiante extra maldecido o no, ¡ni siquiera pensaré en ignorarte! (Del anime *otro*; no demasiado aparente... rip)", 
  "¡No necesito un Sharingan para ver lo hermosa que eres!", 
  "¿Eres Kikyo? ¡Porque creo que me disparaste una flecha en el corazón!",
  "¡Incluso si eso significa arriesgar mi existencia, cruzaré diferentes fronteras del mundo solo para encontrarte! (Steins;Gate)", 
  "¡Oye! ¿Eres el Railgun? ¡Porque puedo sentir una chispa! (Toaru Kagaku no Railgun)",
  "¿Eres de la Casa de Baños? Porque me quitas el espíritu. (Spirited Away)", 
  "¡Omae wa mo shindeiru!", 
  "¡Tú debes ser Kira, porque me acabas de dar un infarto!", 
  "¡Eres más genial que la capa de hielo de Grey!",
  "¡Eres más delicioso que el alma de Ciel!", 
  "Nuestro amor es como Grell, ¡parece que nunca muere!", 
  "¡¡Nacimos para hacer historia!!", 
  "Si fueras una patata, serías una buena patata.",
  "¡No necesito un Death Note, tu belleza es asesina!", 
  "¡Te amo tanto como Ryuk ama las manzanas!", 
  "Te compraré un helado, solo ten cuidado de que no se te caiga...🍦", 
  "¡Llámame All Might, porque solo estoy buscando Texas Smash!",
  "...Homo Total...", 
  "No necesito líneas de recogida, porque no funcionan con cadáveres", 
  "¿Kanye siente el amor?", 
  "¡¡Puedes llevarme a la ciudad del sabor!!",
  "¡Oye, eres bastante bueno!", 
  "¡Me volvería completamente homosexual por ti!", 
  "¡Ojalá murieran todos menos tú!",
];

const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "pickupline",
      description: "¡Genera algunas líneas de recogida!",
      category: "Diversion",
      cooldown: 3,
    });
  }

  async run(message) {
    const embed = new MessageEmbed()
      .setDescription(line[Math.round(Math.random() * (line.length - 1))])
      .setColor(message.client.color.pink);
    return message.channel.sendCustom({ embed }).catch(() => {});
  }
};
