require("dotenv").config();

const { Client, Intents} = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

client.on('ready', _ => {
  console.log(client.user.tag);
});

client.login(process.env.token);