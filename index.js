/**
 * █░█░█ █▀█ █▀█ █▀▄ █░░ █▀▀ █▄▄ █▀█ ▀█▀
 * ▀▄▀▄▀ █▄█ █▀▄ █▄▀ █▄▄ ██▄ █▄█ █▄█ ░█░
 */
// --- Modules --- \\
require("dotenv").config();
const { Client, Intents } = require("discord.js");

// --- Discord Client --- \\
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

// --- Own Modules --- \\
const wordle = require("./src/modules/wordle");
const embeds = require("./src/modules/embeds");

// --- Variables --- \\
const token = process.env.token;
const prefix = process.env.prefix;

// ------------------------------------------------ \\

// --- When Bot started --- \\
client.on('ready', _ => {
  console.log("Logged in as: "+ client.user.tag);
});

// --- When someone sends message --- \\
client.on('messageCreate', msg =>{
  if(msg.author.id == client.user.id) return; //ignore own messages
  const command = msg.content.split(' ');

  if(command[0].startsWith(`${prefix}new`)){
    wordle.newGame(command[1], msg);
  }else if(command[0].startsWith(`${prefix}guess`)){
    wordle.guess(command[1], msg);
  }else if(command[0].startsWith(`${prefix}help`)){
    msg.reply({embeds: [embeds.help(prefix)]});
  }
});

// --- Bot Login --- \\
client.login(token);