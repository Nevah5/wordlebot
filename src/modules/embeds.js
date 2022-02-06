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

module.exports = {
  error,
  guess,
  lastGuess,
  newGame,
  result
};