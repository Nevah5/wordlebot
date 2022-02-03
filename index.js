require("dotenv").config();

const { Client, Intents } = require("discord.js");
const wordle = require("./src/modules/wordle");
const embeds = require("./src/modules/embeds");

const token = process.env.token;
const prefix = process.env.prefix;
console.log("Prefix: '" + prefix + "'");
console.log("Word: '" + wordle.getWord() + "'");

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

client.on('ready', _ => {
  console.log("Logged in as: "+ client.user.tag);
});

client.on('messageCreate', msg =>{
  if(msg.author.id == client.user.id) return;
  if(!msg.content.startsWith(prefix)) return;

  msg.reply({content: msg.content, embeds: [embeds.example(msg.content)]})
  console.log(msg.author.tag + " - " + msg.content);
  msg.react('✅');
})

client.login(token);