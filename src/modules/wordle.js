const { words, gameWords } = require("./words");
const embeds = require("./embeds");
const db = require('./db.js');

getWord = (id) => {
  return gameWords[id];
}

newGame = (id, interaction) => {
  if(id != null){
    // --- Test if user inputted invalid id --- \\
    if(id > gameWords.length || id < 1) return interaction.reply({embeds: [embeds.error("This ID is invalid. [1-"+gameWords.length+"]")], ephemeral: true});
  }else{
    id = Math.floor(Math.random() * (gameWords.length - 1));
  }
  await db.saveID(interaction.user.id, id);
  interaction.reply({embeds: [embeds.newGame(id, interaction.user.id)], ephemeral: true});
}

guess = async (guess, interaction, playNewBtn) => {
  // --- Validate guess --- \\
  if(!/^[a-z]{5}$/.test(guess.toLowerCase())) return interaction.reply({embeds: [embeds.error("This guess is invalid. [Please use 5 letter words to guess]")], ephemeral: true});
  if(!words.includes(guess) && !gameWords.includes(guess)) return interaction.reply({embeds: [embeds.error("Please guess a valid word.")], ephemeral: true});

  // --- Check if user has started game --- \\
  var wordID = await db.getUserGameID(interaction.user.id).catch(_ => {return -1;});
  if(wordID == -1) return interaction.reply({embeds: [embeds.error("You have to start a new game first. Type /new <id (optional)>")], ephemeral: true});
  // --- Split the word into array --- \\
  const word = getWord(wordID);
  var wordSplit = word.split("");

  // --- Check each guess --- \\
  const addGuess = await db.addGuess(interaction.user.id, guess);
  var guesses = addGuess[0];
  var lastGuess = addGuess[1];
  var guessesColors = [];
  var letters = {
    "q": 1, "w": 1, "e": 1, "r": 1, "t": 1, "y": 1, "u": 1, "i": 1, "o": 1, "p": 1,
    "a": 1, "s": 1, "d": 1, "f": 1, "g": 1, "h": 1, "j": 1, "k": 1, "l": 1,
    "z": 1, "x": 1, "c": 1, "v": 1, "b": 1, "n": 1, "m": 1
  };
  // --- Generate colors from each guess user has made --- \\
  guesses.forEach(eachGuess => {
    const split = eachGuess.toLowerCase().split("");
    var chars = {};
    wordSplit.forEach(element => {
      if(chars[element] == null){
        chars[element] = 1;
      }else{
        chars[element] += 1;
      }
    });
    var guessColors = [];
    split.forEach((element, index) => {
      //search for right input characters 🟩
      split.forEach((element2, index2) => {
        if(wordSplit[index2] == element2 && chars[element2] != 0){
          guessColors[index2] = "🟩";
          chars[element2] -= 1;
        }
      });
      //search for right character but wrong position 🟨
      split.forEach((element2, index2) => {
        if(wordSplit.includes(element2) && chars[element2] != 0){
          guessColors[index2] = "🟨";
        }
      });
      //replace all other wrong chars with ⬛
      guessColors.forEach((element2, index2) => {
        if(guessColors[index] == null){
          guessColors[index] = "⬛";
        }
      });
      if(chars[element] == null){
        letters[element] = 0;
        guessColors[index] = "⬛";
      }
    });
    var finalColors = "";
    guessColors.forEach(element => {
      finalColors += element;
    });
    guessesColors.push(finalColors);
  });
  // --- Check if user guessed and send curresponding embed --- \\
  if(!lastGuess && guessesColors[guessesColors.length - 1] != "🟩🟩🟩🟩🟩"){
    interaction.reply({embeds: [embeds.guess(wordID, guesses, guessesColors, interaction.user.id, letters)], ephemeral: true});
  }else{
    await db.clearGameData(interaction.user.id);
    await db.saveStats(interaction.user.id, guessesColors.length, guessesColors[guessColors.length - 1] == "🟩🟩🟩🟩🟩");
    interaction.reply({embeds: [embeds.lastGuess(wordID, guesses, guessesColors, interaction.user.id, getWord(wordID), letters)], ephemeral: true, components: [playNewBtn]});
    interaction.channel.send({embeds: [embeds.result(wordID, guessesColors, interaction.user)]});
  }
}

module.exports = {
  newGame,
  guess
};