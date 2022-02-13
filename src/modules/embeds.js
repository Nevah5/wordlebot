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
const guess = (id, playerGuesses, playerHistory, playerID, letters) => {
  const keyboard = getKeyboard(letters);
  var left = 6;
  var guesses = "";
  playerGuesses.forEach((guess, index) => {
    left -= 1;
    let num = index + 1;
    guesses += num + ". " + guess.toUpperCase() + "\n";
  });
  var board = "";
  playerHistory.forEach(playerGuess => {
    board += playerGuess + "\n";
  });
  var guessesText = left == 1 ? "guess" : "guesses";
  return new MessageEmbed()
  .setTitle("Wordle #"+id)
  .setDescription("<@"+playerID+">")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .addFields(
    {name: "Your guesses:", value: guesses, inline: false},
    {name: "Results "+(6-left)+"/6", value: board, inline: false},
    {name: "Possible letters:", value: keyboard, inline: false}
  )
  .setFooter({text: left + " "+ guessesText + " left, guess with /guess <guess>"})
  .setColor("#6AAA64")
  .setTimestamp();
}
const lastGuess = (id, playerGuesses, playerHistory, playerID, word, letters) => {
  const keyboard = getKeyboard(letters);
  var guesses = "";
  playerGuesses.forEach((guess, index) => {
    let num = index + 1;
    guesses += num + ". " + guess.toUpperCase() + "\n";
  });
  var board = "";
  playerHistory.forEach(playerGuess => {
    board += playerGuess + "\n";
  });
  var infoText = "**You didn't make it. The word was: ||"+word.toUpperCase()+"||.**";
  if(board.endsWith("🟩🟩🟩🟩🟩\n")){
    infoText = "**Congratulations! You made it!**";
  }
  return new MessageEmbed()
  .setTitle("Wordle #"+id)
  .setDescription("<@"+playerID+">")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .addFields(
    {name: "Your guesses:", value: guesses, inline: false},
    {name: "Results "+playerHistory.length+"/6", value: board + "\n"+infoText, inline: false},
    {name: "Possible letters:", value: keyboard, inline: false}
  )
  .setFooter({text: "Start a new game with /new <id (optional)>"})
  .setColor("#6AAA64")
  .setTimestamp();
}
const result = (id, playerHistory, player) => {
  var board = "";
  playerHistory.forEach(playerGuess => {
    board += playerGuess + "\n";
  });
  var outOf = playerHistory.length;
  if(!board.endsWith("🟩🟩🟩🟩🟩\n")){
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
  .setDescription("<@"+playerID+">\nYou successfully started a new game.\n Please start guessing with /guess <guess>.")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setFooter({text: "6 guesses left..."})
  .setColor("#6AAA64")
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
  .setDescription("<@"+id+">\n\nFirst Game:\n"+data[6].toUTCString()+"\n\nLast Game:\n"+data[7].toUTCString()+"\n\n\n**"+statsFrom+" STATISTICS**")
  .setThumbnail(avatarURL)
  .addFields(
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
  .setFooter({text: "See other users stats with /stats @user"})
  .setColor("#6AAA64")
  .setTimestamp();
}
const topServer = (server) => {
  const topPlayers = "";
  return new MessageEmbed()
  .setTitle(`Top players of ${server.name}`)
  .setDescription("The top wordle players in this server.\n\n**Top Players**\nSorted by Games Started")
  .setThumbnail(server.iconURL())
  .addFields(
    {
      name: '\u200b',
      value: '<@938399230614192169>\nGames started: 23\nGames won: 10\nGames finished: 22\nNumber guesses: 130',
      inline: false
    },
    {
      name: '\u200b',
      value: '<@550651191885955072>\nGames started: 21\nGames won: 8\nGames finished: 10\nNumber guesses: 193',
      inline: false
    },
  )
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setFooter({text: `${server.id}`})
  .setColor("#6AAA64")
  .setTimestamp();
}

module.exports = {
  error,
  guess,
  lastGuess,
  newGame,
  result,
  stats,
  topServer
};