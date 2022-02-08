const { MessageSelectMenu, MessageActionRow } = require("discord.js");

const wordle = require("./wordle.js");

exports.interactions = (interaction) => {
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
      wordle.stats(user, interaction);
    }
  }else if(interaction.isButton()){
    if(interaction.customId == "playagain"){
      wordle.newGame(null, interaction);
    }
  }
}

exports.stats = new MessageActionRow()
.addComponents(
  new MessageSelectMenu()
  .setCustomId('stattimeline')
  .setPlaceholder('Lifetime')
  .addOptions([
    {label: 'Today', description: 'The stats of this user from today.', value: 'today'},
    {label: 'Last Week', description: 'The stats of this user since last week.', value: 'lastweek'},
    {label: 'Lifetime', description: 'The lifetime stats of this user.', value: 'lifetime'}
  ])
);