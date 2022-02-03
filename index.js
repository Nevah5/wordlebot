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
console.log("Prefix: '" + prefix + "'");
console.log("Word: '" + wordle.getWord() + "'");

// ------------------------------------------------ \\


// --- Async Functions --- \\
client.on('ready', _ => {
  console.log("Logged in as: "+ client.user.tag);
});

client.on('messageCreate', msg =>{
  if(msg.author.id == client.user.id) return;
  if(!msg.content.startsWith(prefix)) return;

  msg.reply({embeds: [embeds.playerGuess("1", "⬛⬛🟩⬛🟨\n🟨🟨⬛🟩⬛\n⬛🟨🟩⬛🟩\n🟩⬛🟨🟨🟨\n🟩🟩🟩🟨🟨")]})
  console.log(msg.author.tag + " - " + msg.content);
  msg.react('✅');
})

// --- Bot Login --- \\
client.login(token);