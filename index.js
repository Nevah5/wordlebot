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


// --- Async Functions --- \\
client.on('ready', _ => {
  console.log("Logged in as: "+ client.user.tag);
});

client.on('messageCreate', msg =>{
  if(msg.author.id == client.user.id) return;
  const command = msg.content.split(' ');

  if(msg.content.startsWith(`${prefix}play`)){
    msg.react("✅");
  }
})

// --- Bot Login --- \\
client.login(token);