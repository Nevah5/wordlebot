const { MessageEmbed } = require("discord.js");

const error = (message) => {
  return new MessageEmbed()
  .setTitle("Something went wrong!")
  .setDescription(message)
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setFooter({text: "For more information, type /help."})
  .setColor("#CC5066");
}

const guess = (id, playerGuesses, playerHistory, playerID) => {
  var left = 6;
  var guesses = "";
  playerGuesses.forEach((guess, index) => {
    left -= 1;
    let num = index + 1;
    guesses += num + ". ||" + guess.toUpperCase() + "||\n";
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
    {name: "Gameboard "+(6-left)+"/6", value: board, inline: false}
  )
  .setFooter({text: left + " "+ guessesText + " left, guess with /guess <guess>"})
  .setColor("#6AAA64");
}
const lastGuess = (id, playerGuesses, playerHistory, playerID, word) => {
  var guesses = "";
  playerGuesses.forEach((guess, index) => {
    let num = index + 1;
    guesses += num + ". ||" + guess.toUpperCase() + "||\n";
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
    {name: "Gameboard "+playerHistory.length+"/6", value: board + "\n"+infoText, inline: false}
  )
  .setFooter({text: "Start a new game with /new <id (optional)>"})
  .setColor("#6AAA64");
}

const newGame = (id, playerID) => {
  return new MessageEmbed()
  .setTitle("Wordle #"+id)
  .setDescription("<@"+playerID+">")
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .addFields(
    {name: "Gameboard 0/6:", value: "🟦🟦🟦🟦🟦\n🟦🟦🟦🟦🟦\n🟦🟦🟦🟦🟦\n🟦🟦🟦🟦🟦\n🟦🟦🟦🟦🟦\n🟦🟦🟦🟦🟦", inline: false}
  )
  .setFooter({text: "6 guesses left, guess with /guess <guess>"})
  .setColor("#6AAA64");
}

module.exports = {
  error,
  guess,
  lastGuess,
  newGame
};