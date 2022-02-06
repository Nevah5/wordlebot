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
  .setColor("#6AAA64")
  .setTimestamp();
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
const help = (prefix) => {
  return new MessageEmbed()
  .setTitle("Help Menu")
  .setDescription("Please support me on [GitHub](https://github.com/nevah5/wordlebot/)!\nPrefix: "+prefix)
  .setThumbnail("https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png")
  .setAuthor({ name: "Wordlebot", iconURL: "https://raw.githubusercontent.com/Nevah5/wordlebot/main/src/images/logo.png", url: "https://github.com/nevah5/wordlebot"})
  .setColor("#6AAA64")
  .addFields(
    {name: `${prefix}new <ID (optional)>`, value: `Start a new game by typing ${prefix}new in a channel. You will get a new wordle with a random word. Each word has an ID, that curresponds to a word. If you for example want to play the same word as your friend you can use the same command with the wordle ID that your friend got. Example: ${prefix}new 531.`, inline: false},
    {name: `${prefix}guess <guess>`, value: `When you started a new game, you can start guessing the word. Example: ${prefix}guess hello`},
    {name: `${prefix}help`, value: "This command calls this message here."}
  )
  .setTimestamp();
}

module.exports = {
  error,
  guess,
  lastGuess,
  newGame,
  help
};