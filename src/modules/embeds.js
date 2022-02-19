const { MessageEmbed } = require("discord.js");

const error = (message) => {
  return new MessageEmbed()
  .setTitle("Something went wrong!")
  .setDescription(message)
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setFooter({text: "For more information, type /help."})
  .setColor("#CC5066")
  .setTimestamp();
}
const getKeyboard = (letters) => {
  var keyboard = "**~~-------------------------------------------~~**\n";
  var i = 0;
  var j = 0;
  for(const [key, val] of Object.entries(letters)){
    i++;
    keyboard += val != 0 ? ":regional_indicator_"+key+": " : "⬛ ";
    if(i == 10){
      j++;
      i = 0;
      keyboard += "\n᲼";
    }else if(i == 9 && j == 1){
      i = 0;
      keyboard += "\n᲼᲼᲼";
    }
  }
  keyboard += "\n**~~-------------------------------------------~~**";
  return keyboard;
}
const guess = (id, guessesAmount, playerBoard, playerID, letters) => {
  const keyboard = getKeyboard(letters);
  var left = 6 - guessesAmount;
  var board = "";
  playerBoard.forEach(playerGuess => {
    board += playerGuess + "\n";
  });
  var guessesText = left == 1 ? "guess" : "guesses";
  return new MessageEmbed()
  .setTitle("Wordle #"+id)
  .setDescription("<@"+playerID+">")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .addFields(
    {name: "Guesses "+guessesAmount+"/6", value: board, inline: false},
    {name: "Possible letters:", value: keyboard, inline: false}
  )
  .setFooter({text: left + " "+ guessesText + " left, guess with /guess <guess>"})
  .setColor("#6AAA64")
  .setTimestamp();
}
const lastGuess = (id, playerBoard, playerID, word, letters) => {
  const keyboard = getKeyboard(letters);
  var board = "";
  playerBoard.forEach(playerGuess => {
    board += playerGuess + "\n";
  });
  var infoText = "**You didn't make it. The word was: ||"+word.toUpperCase()+"||.**";
  if(playerBoard[playerBoard.length - 2] == "🟩🟩🟩🟩🟩"){
    infoText = "**Congratulations! You made it!**";
  }
  return new MessageEmbed()
  .setTitle("Wordle #"+id)
  .setDescription("<@"+playerID+">")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .addFields(
    {name: "Guesses "+(playerBoard.length / 2)+"/6", value: board + "\n"+infoText, inline: false},
    {name: "Possible letters:", value: keyboard, inline: false}
  )
  .setFooter({text: "Start a new game with /new <id (optional)>"})
  .setColor("#6AAA64")
  .setTimestamp();
}
const result = (id, playerBoard, player) => {
  var board = "";
  playerBoard.forEach((playerGuess, index) => {
    //delete word guess out of array
    if(index % 2 == 0){
      board += playerGuess.replaceAll(' ', '') + "\n";
    }
  });
  var outOf = playerBoard.length / 2;
  if(playerBoard[playerBoard.length - 2] != "🟩🟩🟩🟩🟩"){
    outOf = "X";
  }
  return new MessageEmbed()
  .setTitle("Wordle #"+id)
  .setDescription("<@"+player.id+">")
  .setThumbnail(player.avatarURL())
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .addFields(
    {name: "Results "+outOf+"/6", value: board, inline: false}
  )
  .setFooter({text: "Play this wordle with /new "+id})
  .setColor("#6AAA64")
  .setTimestamp();
}
const newGame = (id, playerID) => {
  return new MessageEmbed()
  .setTitle("Wordle #"+id)
  .setDescription("<@"+playerID+">\nYou successfully started a new game.\nPlease start guessing with /guess.")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setFooter({text: "6 guesses left..."})
  .setColor("#6AAA64")
  .setTimestamp();
}
const daily = (id, playerID) => {
  return new MessageEmbed()
  .setTitle("Daily Wordle #"+id)
  .setDescription("<@"+playerID+">\nYou successfully started the daily wordle.\nPlease start guessing with /guess.")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setFooter({text: "6 guesses left..."})
  .setColor("#5865F2")
  .setTimestamp();
}
const stats = (id, avatarURL, username, data) => {
  /**
   * data[0] -> Games started
   * data[1] -> Games won
   * data[2] -> Games finished
   * data[3] -> Winrate
   * data[4] -> Guess Color display graph
   * data[5] -> timeline string
   * data[6] -> first game timestamp
   * data[7] -> last game timestamp
   */
  const firstGame = new Date(data[6].toUTCString()).getTime() / 1000;
  const lastGame = new Date(data[7].toUTCString()).getTime() / 1000;
  var statsFrom = "LIFETIME";
  if(data[5] == "1 DAY"){
    statsFrom = "LAST 24h";
  }else if(data[5] == "7 DAY"){
    statsFrom = "LAST WEEK";
  }
  var gameStats = "🟩 - " + data[0] + " Games started - 🟩\n";
  gameStats += "The amount of games the user has started.\n\n";
  gameStats += "🟩 - " + data[1] + " Games won - 🟩\n";
  gameStats += "The amount of games the user has guessed the word.\n\n";
  gameStats += "🟩 - " + data[2] + " Games finished - 🟩\n";
  gameStats += "The amount of games the user has finished, either won or lost.\n\n";
  gameStats += "🟩 - " + data[3] + "% Winrate - 🟩\n";
  gameStats += "The winrate is calculated by the amount of games started, divided by the amount of games won.\n";
  return new MessageEmbed()
  .setTitle(username+"'s Statistics")
  .setDescription("<@"+id+">\n\n**STATISTICS ("+statsFrom+")**")
  .setThumbnail(avatarURL)
  .addFields(
    {
      name: "/ ----- **WORDLES** ----- \\",
      value: "First Wordle:\n<t:"+firstGame+">\n\nLast Wordle:\n<t:"+lastGame+">\n",
      inline: false
    },
    {
      name: "/ ------ **GAMES** ------ \\",
      value: gameStats,
      inline: false
    },
    {
      name: "/ ------ **GUESSES** ------ \\",
      value: data[4] + "\nThe stats from all games the user has finished.",
      inline: false
    }
  )
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setFooter({text: "See other users stats with /stats user"})
  .setColor("#6AAA64")
  .setTimestamp();
}
const topServer = (server, data, sort) => {
  const topPlayers = "";
  let sortInfo = {
    "winrate": "Winrate",
    "finished": "Games finished",
    "guesses": "Number guesses",
    "started": "Games started",
    "won": "Games won"
  };
  var embed = new MessageEmbed()
  .setTitle(`Top players of ${server.name}`)
  .setDescription("The top wordle players in this server.\n\n**Top Players**\nSorted by " + sortInfo[sort])
  .setThumbnail(server.iconURL())
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setFooter({text: `${server.id}`})
  .setColor("#6AAA64")
  .setTimestamp();

  data.forEach((element, index) => {
    let end = ["st", "nd", "rd", "th", "th"];
    let winrate = (Math.floor((100 / element.started * element.won) * 100) / 100) + "%";
    let stats = {
      "winrate": `${sortInfo.winrate}: ${winrate}`,
      "won": `${sortInfo.won}: ${element.won}`,
      "started": `${sortInfo.started}: ${element.started}`,
      "finished": `${sortInfo.finished}: ${element.finished}`,
      "guesses": `${sortInfo.guesses}: ${element.numGuesses}`
    };
    if(sort == "winrate"){
      stats.winrate = `**${sortInfo.winrate}: ${winrate}**`;
    }else if(sort == "won"){
      stats.won = `**${sortInfo.won}: ${element.won}**`
    }else if(sort == "finished"){
      stats.finished = `**${sortInfo.finished}: ${element.finished}**`;
    }else if(sort == "guesses"){
      stats.guesses = `**${sortInfo.guesses}: ${element.numGuesses}**`;
    }else if(sort == "started"){
      stats.started = `**${sortInfo.started}: ${element.started}**`;
    }
    let value = `<@${element.userID}>\n${stats.winrate}\n${stats.won}\n${stats.started}\n${stats.finished}\n${stats.guesses}`;
    embed.addField("➡️ " + (index + 1) + end[index] + " Place", value, false);
  });
  return embed;
}
const help = _ => {
  return new MessageEmbed()
  .setTitle("Wordlebot Help")
  .setDescription("This is a discord bot for the wordle game made by Nevah#0001.")
  .addFields(
    {
      name: "Game instructions",
      value: "Wordle is a game made by Josh Wardle in 2021. He made it for people to have something to play each day during the covid pandemic. The player has to guess a word and is given different colors as info, based on which letters are correct and which are not.\n\n🟩 - The letter is correct and in the correct position.\n🟨 - The letter is in the word, but not in the correct position.\n⬛ - The letter is not in the word.",
      inline: false
    },
    {
      name: "Commands",
      value: "/new <(optional) id>\nTo start a new game, type /new with optionally a specific id.\n\n/guess <guess>\nIf you have started a new game, you can guess any 5 letter word.\n\n/daily\nThis command lets you play the word for today if you havent played it.\n\n/stats <user / server> <@user>\nThis command shows the stats of a specific player or the stats of the top 5 players in the server.",
      inline: false
    },
  )
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setFooter({text: "Please DM me if you find any bugs."})
  .setColor("#6AAA64");
}
const gameongoing = (id) => {
  const idtext = id != null ? ` (#${id})` : ``;
  return new MessageEmbed()
  .setTitle("Careful!")
  .setDescription("You already have a game ongoing!\nIf you start a new one, you cant play this one again.\nDo you want to continue?")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setFooter({text: "Click the button below to start a new game."+idtext})
  .setTimestamp()
  .setColor("#F72F2F");
}
module.exports = {
  error,
  guess,
  lastGuess,
  newGame,
  daily,
  result,
  stats,
  topServer,
  help,
  gameongoing
};