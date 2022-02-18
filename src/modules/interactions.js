const { MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js");

const wordle = require("./wordle.js");
const embeds = require('./embeds.js');

exports.interactions = async (client, interaction) => {
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
          .setLabel("Play a new wordle")
          .setStyle('SUCCESS')
        )
      wordle.guess(guess, interaction, playNewBtn);
    }else if(commandName === 'stats'){
      if(options.getSubcommand() == 'user'){
        let user = options.getUser('user');
        wordle.stats(user, interaction);
      }else if(options.getSubcommand() == 'server'){
        wordle.topServer(interaction);
      }
    }else if(commandName === 'daily'){
      wordle.daily(interaction);
    }else if(commandName === 'help'){
      interaction.reply({embeds: [embeds.help()], ephemeral: true});
    }
  }else if(interaction.isButton()){
    if(interaction.customId == "playagain"){
      wordle.newGame(null, interaction);
    }else if(interaction.customId == "playthiswordle"){
      let id = interaction.message.embeds[0].title.split("#")[1];
      if(interaction.message.embeds[0].description.split("<@")[1].split(">")[0] == interaction.user.id){
        interaction.reply({embeds: [embeds.error("You can't play this wordle again!")], ephemeral: true})
      }else{
        wordle.newGame(id, interaction);
      }
    }else if(interaction.customId == 'confirmnew'){
      var id = null;
      if(/([(]{1}[#]{1}[0-9]*[)]{1})/.test(interaction.message.embeds[0].footer.text)){
        id = interaction.message.embeds[0].footer.text.split("(#")[1].split(")")[0];
      }
      wordle.newGame(id, interaction, true);
    }else if(interaction.customId == 'confirmnewdaily'){
      wordle.daily(interaction, true);
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
      var user = await client.users.fetch(userID);
      wordle.stats(user, interaction, interval);
    }else if(interaction.customId == "serverstat"){
      wordle.topServer(interaction);
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

exports.serverstats = new MessageActionRow()
.addComponents(
  new MessageSelectMenu()
  .setCustomId('serverstat')
  .setPlaceholder('Select SORT BY')
  .addOptions([
    {label: 'Winrate', description: 'Orders the top players by winrate.', value: 'winrate'},
    {label: 'Games Won', description: 'Orders the top players by games won.', value: 'won'},
    {label: 'Games Started', description: 'Orders the top players by games started.', value: 'started'},
    {label: 'Games Finished', description: 'Orders the top players by games finished.', value: 'finished'},
    {label: 'Number Guesses', description: 'Orders the top players by number guesses.', value: 'guesses'}
  ])
)

exports.playThisWordle = new MessageActionRow()
.addComponents(
  new MessageButton()
  .setCustomId('playthiswordle')
  .setLabel("Play this wordle")
  .setStyle('SUCCESS')
)

exports.confirmStartNew = new MessageActionRow()
.addComponents(
  new MessageButton()
  .setCustomId('confirmnew')
  .setLabel('Continue and start a new game!')
  .setStyle('DANGER')
)
exports.confirmStartNewDaily = new MessageActionRow()
.addComponents(
  new MessageButton()
  .setCustomId('confirmnewdaily')
  .setLabel('Continue and start a new game!')
  .setStyle('DANGER')
)