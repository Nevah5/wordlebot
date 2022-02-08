const { words, gameWords } = require("./words");
const embeds = require("./embeds");
const db = require('./db.js');
const interactions = require("./interactions.js");

getWord = (id) => {
  return gameWords[id];
}

newGame = async (id, interaction) => {
  if(id != null){
    // --- Test if user inputted invalid id --- \\
    if(id > gameWords.length || id < 1) return interaction.reply({embeds: [embeds.error("This ID is invalid. [1-"+gameWords.length+"]")], ephemeral: true});
  }else{
    id = Math.floor(Math.random() * (gameWords.length - 1));
  }
  await db.saveID(interaction.user.id, id);
  await db.saveStats(interaction.user.id, -2, true);
  interaction.reply({embeds: [embeds.newGame(id, interaction.user.id)], ephemeral: true});
}

guess = async (guess, interaction, playNewBtn) => {
  // --- Validate guess --- \\
  if(!/^[a-z]{5}$/.test(guess.toLowerCase())) return interaction.reply({embeds: [embeds.error("This guess is invalid. [Please use 5 letter words to guess]")], ephemeral: true});
  if(!words.includes(guess) && !gameWords.includes(guess)) return interaction.reply({embeds: [embeds.error("Please guess a valid word.")], ephemeral: true});

  // --- Check if user has started game --- \\
  var wordID = await db.getUserGameID(interaction.user.id).catch(_ => { return -1; });
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
    await db.saveStats(interaction.user.id, guessesColors.length, guessesColors[guessesColors.length - 1] == "🟩🟩🟩🟩🟩");
    interaction.reply({embeds: [embeds.lastGuess(wordID, guesses, guessesColors, interaction.user.id, getWord(wordID), letters)], ephemeral: true, components: [playNewBtn]});
    interaction.channel.send({embeds: [embeds.result(wordID, guessesColors, interaction.user)]});
  }
}

stats = async (user, interaction) => {
  if(user == null){ user = interaction.user; }
  if(user.bot) return interaction.reply({embeds: [embeds.error("You can not get the stats of a bot!")], ephemeral: true});
  const data = await db.getStats(user.id).catch(_ => { return null; });
  if(!data) return interaction.reply({embeds: [embeds.error("This user unfortunatly doesn't have any stats yet!")], ephemeral: true});
  var totalgames = 0;
  var totalgamesfinished = 0;
  var gamesWon = 0;
  var tries = [0, 0, 0, 0, 0, 0, 0];
  //put data into vars
  data.forEach(datapacket => {
    totalgames++;
    totalgamesfinished += datapacket.guesses >= -1;
    gamesWon += datapacket.guesses >= 0;
    tries[0] += datapacket.guesses == 1 ? 1 : 0;
    tries[1] += datapacket.guesses == 2 ? 1 : 0;
    tries[2] += datapacket.guesses == 3 ? 1 : 0;
    tries[3] += datapacket.guesses == 4 ? 1 : 0;
    tries[4] += datapacket.guesses == 5 ? 1 : 0;
    tries[5] += datapacket.guesses == 6 ? 1 : 0;
    tries[6] += datapacket.guesses == -1 ? 1 : 0;
  });
  //generate guesses statistics
  var guessStatsDisplay = "";
  var guessStatsDisplayNums = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣","6️⃣", ":regional_indicator_x:"]
  var colorsStatsDisplay = ["🟩", "🟨", "⬛"];
  var valuesColorStatsDisplay = [10, 7, 4];
  tries.forEach((trie, index) => {
    var winrate = Math.floor((100 / totalgamesfinished * trie) * 100) / 100;
    if(winrate == Infinity){
      winrate = 0;
    }
    guessStatsDisplay += guessStatsDisplayNums[index];
    var leftWinrate = winrate;
    colorsStatsDisplay.forEach((element, index) => {
      const mult = Math.floor(leftWinrate / valuesColorStatsDisplay[index]);
      leftWinrate -= mult * valuesColorStatsDisplay[index];
      for(i = 0; i < mult; i++){
        guessStatsDisplay += element;
      }
    });
    guessStatsDisplay += " " + winrate + "%";
    guessStatsDisplay += "\n";
  });
  winrate = Math.floor((100 / totalgames * gamesWon) * 100) / 100;
  var embedData = [totalgames, totalgamesfinished, gamesWon, winrate, guessStatsDisplay];
  interaction.reply({embeds: [embeds.stats(user.id, user.avatarURL(), user.username, embedData)], components: [interactions.stats], ephemeral: false});
}

module.exports = {
  newGame,
  guess,
  stats
};