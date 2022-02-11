/**
 * █░█░█ █▀█ █▀█ █▀▄ █░░ █▀▀ █▄▄ █▀█ ▀█▀
 * ▀▄▀▄▀ █▄█ █▀▄ █▄▀ █▄▄ ██▄ █▄█ █▄█ ░█░
 */
// --- Modules --- \\
require("dotenv").config();
const { Client, Intents, MessageActionRow, MessageButton } = require("discord.js");

// --- Discord Client --- \\
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
});

// --- Own Modules --- \\
const interactions = require("./src/modules/interactions");

// --- Variables --- \\
const token = process.env.token;

// ------------------------------------------------ \\

// --- When Bot started --- \\
client.on('ready', _ => {
  console.log("Logged in as: "+ client.user.tag);

  // --- Set rich presence --- \\
  client.user.setActivity("Wordle on Discord", {
    type: "PLAYING"
  });

  // --- Register commands --- \\
  const guild = client.guilds.cache.get("908019966022942730");
  var commands = guild.commands; // --- Guild commands --- \\
  // var commands = client.application.commands; // --- Global commands --- \\
  // --- /new --- \\
  commands.create({
    name: 'new',
    description: 'Start a new wordle game.',
    options: [
      {
        name: 'id',
        description: 'Wordle ID',
        required: false,
        type: "NUMBER",
        minValue: 1
      }
    ]
  });
  // --- /guess --- \\
  commands.create({
    name: 'guess',
    description: 'Guess a word on your current game.',
    options: [
      {
        name: 'word',
        description: 'Guess a 5 character long word.',
        required: true,
        type: "STRING"
      }
    ]
  });
  // --- /stats --- \\
  commands.create({
    name: 'stats',
    description: 'Show the stats of a user.',
    options: [
      {
        name: 'user',
        description: 'Guess a 5 character long word.',
        required: false,
        type: "USER"
      }
    ]
  });
});

client.on('interactionCreate', async (interaction) => {
  interactions.interactions(client, interaction);
});

// --- Bot Login --- \\
client.login(token);