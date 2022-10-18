<h1 align="center">
  <br>
  Roxxy Discord Bot [DJS V13]
 <br>
</h1>

<h3 align=center>Un bot totalmente personalizable creado con 147 comandos, 11 categorías y un panel usando discord.js v13</h3>


<div align=center>

 <a href="https://github.com/mongodb/mongo">
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white" alt="mongo">
  </a>
  
  <a href="https://github.com/discordjs">
    <img src="https://img.shields.io/badge/discord.js-v13.6.0-blue.svg?logo=npm" alt="discordjs">
  </a>

  <a href="https://github.com/peterhanania/Pogy/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202-blue" alt="license">
  </a>

</div>

<p align="center">
  <a href="#sobre">Sobre</a>
  •
  <a href="#caracteristicas">Características</a>
  •
  <a href="#instalacion">Instalación</a>
  •
  <a href="#configuracion">Configuración</a>
  •
  <a href="#licencia">Licencia</a>
  •
  <a href="#creditos">Créditos</a>
</p>

## Sobre

Roxxy es una bot de discord hecha a base del código de Pogy, otro bot de discord que se creo hace exactamente 2 años, el código estaba roto, así que se decidió corregir los errores y convertirlo en un bot multipropósito discord.js v13. ¡Puedes hacer clic en [este enlace](https://pogy.xyz/invite) para invitar al Bot oficial! Además, puede unirse al [servidor de soporte oficial de Pogy](https://pogy.xyz/support) para obtener ayuda.

Si te gustó este repositorio, no dudes en dejar una estrella ⭐

## Características

¡**147** comandos y **11** categorías diferentes!

- **detector de alt:** bloquea los alt del gremio
- **aplicaciones:** Administrar aplicaciones desde el sitio web
- **config:** Configurar los ajustes del servidor
- **utilidad:** algunos comandos de utilidad
- **economía:** Iniciado pero no terminado
- **diversión:** Un montón de comandos para mantener tu servidor activo
- **imágenes:** Comandos de imagen
- **información:** Información Comandos
- **moderación:** Comandos de modificación para moderar tu servidor de discordia
- **roles de reacción:** roles de reacción
- **entradas:** entradas de gremio para apoyo

Roxxy incluso tiene las siguientes características en el sitio web

- **Transcripciones de tickets** + **Transcripciones de solicitudes**
- Página **Contacto e informe**
- **Mensajes de bienvenida** y **mensajes de despedida** incluyendo embeds.
- **Registro** y **moderación** totalmente personalizables
- **Sugerencias** e **Informes de servidor** completamente personalizables
- Un **sistema Premium** integrado
- Un modo de mantenimiento incorporado
- Una página de miembros
- Auto Mod, Nivelación y Comandos (no hecho)
- API TOP.gg integrada


 <h1 align="center">
  <a href="https://github.com/virtualox-sys"><img src="https://cdn.cleris.es/images/7i3j1.png"></a>
</h1>

**Webhooks: (para desarrollador)**
¡Con Roxxy, incluso puede registrar todo utilizando webhooks directamente desde el archivo de configuración!

<h1 align="center">
  <a href="https://github.com/virtualox-sys"><img src="https://cdn.cleris.es/images/48u91.png"></a>
</h1>

## Instalación

Primero clone el repositorio:

```
git clone https://github.com/VirtualOx-sys/roxxy.git
```

Después de la clonación, ejecute un

```
npm install
```

## Configuración

Tu `config.json` debe seguir

- "developers": ID de los desarrolladores que pueden usar los comandos de propietario [ARRAY],
- "status": El estado de tu bot [STRING],
- "discord": El servidor de soporte de su bot [STRING],
- "dashboard": Si desea habilitar el panel de control del sitio web ["true" / "false"] (STRING),
- "server": Su ID de servidor de soporte [STRING],
- "prefix": Su prefijo de bot predeterminado [STRING],
  
Webhooks
- "logs": URL de webhook para registros de comandos.,
-  "maintenance_logs": URL de webhook para registros de mantenimiento (si se activa automáticamente),
-  "ratelimit_logs": URL de webhook para registros de límite de velocidad,
- "blacklist": URL de webhook para registros de lista negra,
-  "report": URL de webhook para registros de informes,
-  "contact": URL de webhook para registros de contactos,
-  "bugs": URL de webhook para registros de errores,
-  "premium": URL de webhook para registros premium,
-  "suggestions": URL de webhook para registros de sugerencias,
-  "votes": URL de webhook para registros de votos,
-  "errors": URL de webhook para registros de errores,
-  "auth": URL de webhook para registros de autenticación,
-  "joinsPublic": URL de webhook para anunciar las uniones del servidor en el servidor de soporte,
-  "joinsPrivate": URL de webhook para anunciar las uniones del servidor en su servidor privado,
-  "leavesPublic": URL de webhook para anunciar la salida del servidor en el servidor de soporte,
-  "leavesPrivate": URL de webhook para anunciar la salida del servidor en el servidor privado,
-  "maintenance": Habilitar automáticamente el modo de mantenimiento si se limita la velocidad ["true" / "false"] (STRING),
-  "maintenance_threshold": Se recomienda la cantidad de activadores de límite de velocidad necesarios para habilitar el modo de mantenimiento [STRING] [3-10]. Ejemplo "3",
-  "invite_link": El enlace de invitación de tu bot,

SEO
-  "enabled": si desea habilitar SEO ["true" / "false"] (STRING),
-  "title": El título de SEO de su sitio web [STRING],
-  "description": La descripción de SEO de su sitio web [STRING],

##


Su `.env` debe coincidir

LOS NECESARIOS
- TOKEN=TU TOKEN DE BOT
- MONGO=URL DE LA BASE DE DATOS DE MONGO
- SESSION_SECRET=UNA CADENA ALEATORIA PARA LA SEGURIDAD DE LA SESIÓN (Ej. 6B4E8&G#%Z&##bqcyEL5)
- AUTH_DOMAIN=Su dominio de autenticación (por ejemplo, https://roxxy.es o http://localhost:3000) sin barra al final.
- MAIN_CLIENT_ID=la identificación del cliente de su aplicación principal
- AUTH_CLIENT_ID=la identificación del cliente de su aplicación de autenticación
- AUTH_CLIENT_SECRET=el secreto del cliente de su aplicación de autenticación
- PORT=el puerto de tu sitio web | defecto=3000

OPCIONAL
- ANALYTICS=su código de análisis de Google,
- GOOGLE_SITE_VERIFICATION=su código de verificación del sitio de Google,
- DATADOG_API_KEY=la clave api de su Data Dog,
- DATADOG_API_HOST=su host de api de Data Dog,
- DATADOG_API_PREFIX=su prefijo api de Data Dog,
- DBL_AUTH=su autorización dbl



**Las devoluciones de llamada en el portal de desarrollo de Discord**
Esto tendrá 2 partes, devolución de llamada para la identificación del cliente principal y la otra para la identificación del cliente de autenticación. Se Hizo esto para que el cliente principal no tenga una tasa limitada. Puede usar la misma identificación para main_client_id y auth_client_id y colocar las 3 devoluciones de llamada en la misma aplicación.

ID CLIENTE PRINCIPAL
ejemplo tudominio/gracias https://roxxy.es/thanks o http://localhost:3000/thanks
ejemplo tudominio/gracias https://roxxy.es/window o http://localhost:3000/window

ID DE CLIENTE AUTORIZADO
ejemplo sudominio/de devolución de llamada https://roxxy.es/callback o http://localhost:3000/callback


**TOP.gg** 
Para agregar top.gg a su sitio, agregue `DBL_AUTH` como su clave dbl api al archivo `.env`. Y `yourdomain/dblwebhook` como una URL de webhook en la configuración del sitio de top.gg. Ejemplo: `https://yourbot.com/dblwebhook
**Replit**
Para ejecutar en replit, debe instalar node.js `v.16.9.1` para hacerlo, vaya a bash (la terminal bash en su replit) y pegue: `npm init -y && npm i --save-dev node@16.9.0 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH`

Por favor, asegúrese de haber habilitado `Intentos privilegiados` en su [portal de desarrollador de Discord] (https://discordapp.com/developers/applications/). Puede encontrar estos intentos en la sección "Bot", y hay dos marcas que debe activar. Para obtener más información sobre las intenciones de puerta de enlace, consulta [este] enlace (https://discordjs.guide/popular-topics/intents.html#the-intents-bit-field-wrapper).

Puede iniciar el bot con `npm start`

**Nota importante:** Antes de unirse al servidor de soporte para obtener ayuda, lea la guía detenidamente.

### Emojis

- Puedes cambiar los emojis en: <br>
  1- `assets/emojis.json` <br>
  2- `data/emoji.js`

### Colores

- Puedes cambiar los colores en `data/colors.js`

## Licencia

Publicado bajo la licencia [Apache](http://www.apache.org/licenses/LICENSE-2.0).

## Donar

¡Puedes donar a Pogy y hacerlo más fuerte que nunca [haciendo clic aquí](https://paypal.me/pogybot)!

## Créditos
[Créditos antiguos](https://github.com/peterhanania/pogy#credits)
- Peter Hanania [Reescritura de DJS] - [github.com/peterhanania](github.com/peterhanania)
- JANO [Reescritura de DJS] - [github.com/wlegit](github.com/wlegit)
- VirtualOx [Reescritura en español] - [github.com/virtualox-sys](github.com/virtualox-sys)
