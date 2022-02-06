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
  ]
});

// --- Own Modules --- \\
const wordle = require("./src/modules/wordle");
const words = require("./src/modules/words");
const embeds = require("./src/modules/embeds");

// --- Variables --- \\
const token = process.env.token;
const prefix = process.env.prefix;

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
});

client.on('interactionCreate', async (interaction) => {
  if(!interaction.isCommand) return;

  const { commandName, options } = interaction;

  if(commandName === 'new'){
    let id = options.getNumber('id');
    wordle.newGame(id, interaction);
  }else if(commandName === 'guess'){
    let guess = options.getString('word');
    wordle.guess(guess, interaction);
  }
})

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