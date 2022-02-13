const { MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js");

const wordle = require("./wordle.js");

exports.interactions = (client, interaction) => {
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
      console.log(options);
      if(options.getSubcommand() == 'user'){
        let user = options.getUser('user');
        wordle.stats(user, interaction);
      }else if(options.getSubcommand() == 'server'){
        wordle.topServer(interaction);
      }
    }
  }else if(interaction.isButton()){
    if(interaction.customId == "playagain"){
      wordle.newGame(null, interaction);
    }
  }else if(interaction.isSelectMenu()){
    if(interaction.customId == "stattimeline"){
      let selection = interaction.values[0];
      var interval = "LIFETIME";
      if(selection == 'lastweek'){
        interval = "7 DAY";
      }else if(selection == 'today'){
        interval = "1 DAY";
      }
      var userID = interaction.message.embeds[0].description.split('>')[0].split('<@')[1];
      var user = client.users.fetch(userID);
      wordle.stats(user.User, interaction, interval);
    }
  }
}

exports.stats = new MessageActionRow()
.addComponents(
  new MessageSelectMenu()
  .setCustomId('stattimeline')
  .setPlaceholder('Select Statistic Timespan')
  .addOptions([
    {label: 'Last 24h', description: 'The stats of this user from the last 24 hours.', value: 'today'},
    {label: 'Last Week', description: 'The stats of this user since last week.', value: 'lastweek'},
    {label: 'Lifetime', description: 'The lifetime stats of this user.', value: 'lifetime'}
  ])
);