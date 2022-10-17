const mongoose = require('mongoose');

const guildConfigSchema = mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  welcomeToggle: {
    type: mongoose.SchemaTypes.String,
    default: false,
  },
  welcomeDM: {
    type: mongoose.SchemaTypes.String,
    default: false
  },
  welcomeChannel:{
    type: mongoose.SchemaTypes.String,
    default: null,
  },
  welcomeMessage:{
    type: mongoose.SchemaTypes.String,
    default: `¡Bienvenido {user} a {guild}! ¡Ahora tenemos {memberCount} miembros!`,
  },
  welcomeEmbed:{
    type: mongoose.SchemaTypes.String,
    default: false,
  },

  embed: {

  title: {
    type: mongoose.SchemaTypes.String,
    default: `¡Bienvenido!`,
    },
     
  titleURL: {
    type: mongoose.SchemaTypes.String,
    default: ``,
    },

    description: {
    type: mongoose.SchemaTypes.String,
    default: `¡Bienvenido {user} a {guild}! ¡Ahora tenemos {memberCount} miembros!`,
    },
    footer: {
    type: mongoose.SchemaTypes.String,
    default: ``,
    },
    footerIcon: {
    type: mongoose.SchemaTypes.String,
    default: ``,
    },
    color: {
    type: mongoose.SchemaTypes.String,
    default: `#000000`,
    },
    timestamp :{
    type: mongoose.SchemaTypes.String,
    default: false,
    },

    thumbnail: {
    type: mongoose.SchemaTypes.String,
    default: ``,
    },

    image: {
    type: mongoose.SchemaTypes.String,
    default: ``,
    },

    author: {

    name: {
    type: mongoose.SchemaTypes.String,
    default: ``,
    },

    
    url: {
    type: mongoose.SchemaTypes.String,
    default: ``,
    },

    icon: {
    type: mongoose.SchemaTypes.String,
    default: ``,
    },
    
    },

  },


});

module.exports = mongoose.model('welcome-module', guildConfigSchema);