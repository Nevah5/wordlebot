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
const wordle = require("./src/modules/wordle");

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
  if(interaction.isCommand()) {
    const { commandName, options } = interaction;

    if(commandName === 'new'){
      let id = options.getNumber('id');
      wordle.newGame(id, interaction);
    }else if(commandName === 'guess'){
      let guess = options.getString('word');
      const playNewBtn = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setCustomId('playagain')
          .setLabel("Play Again")
          .setStyle('SUCCESS')
        )
      wordle.guess(guess, interaction, playNewBtn);
    }else if(commandName === 'stats'){
      let user = options.getUser('user');
      wordle.stats(user, interaction, user.username);
    }
  }else if(interaction.isButton()){
    if(interaction.customId == "playagain"){
      wordle.newGame(null, interaction);
    }
  }
});

// --- Bot Login --- \\
client.login(token);