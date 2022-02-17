const { words, gameWords } = require("./words");
const embeds = require("./embeds");
const db = require('./db.js');
const interactions = require("./interactions.js");
const { DATE, NEWDATE } = require("mysql/lib/protocol/constants/types");

getWord = (id) => {
  return gameWords[id];
}

newGame = async (id, interaction) => {
  const dailyID = getDailyID();
  if(id != null){
    // --- Test if user inputted invalid id --- \\
    if(id > dailyID || id < 1) return interaction.reply({embeds: [embeds.error("This ID is invalid. [1-"+dailyID+"]")], ephemeral: true});
  }else{
    //generate non played id
    if(await db.getAmountPlayed(interaction.user.id, interaction.guild.id) >= dailyID){
      return interaction.reply({embeds: [embeds.error("You have already played every wordle. Amazing! Please come back later for more.")], ephemeral: true});
    }
    do{
      id = Math.floor(Math.random() * (dailyID + 1));
    }while(await db.checkPlayed(interaction.user.id, interaction.guild.id, id));
  }
  //check if user hasnt played this id yet
  if(await db.checkPlayed(interaction.user.id, interaction.guild.id, id)){
    return interaction.reply({embeds: [embeds.error("You can't play this wordle again!")], ephemeral: true});
  }
  await db.saveID(interaction.user.id, id, interaction.guild.id);
  await db.saveStats(interaction.user.id, -2, true, interaction.guild.id);
  interaction.reply({embeds: [embeds.newGame(id, interaction.user.id)], ephemeral: true});
}

guess = async (guess, interaction, playNewBtn) => {
  // --- Validate guess --- \\
  if(!/^[a-z]{5}$/.test(guess.toLowerCase())) return interaction.reply({embeds: [embeds.error("This guess is invalid. [Please use 5 letter words to guess]")], ephemeral: true});
  if(!words.includes(guess) && !gameWords.includes(guess)) return interaction.reply({embeds: [embeds.error("Please guess a valid word.")], ephemeral: true});

  // --- Check if user has started game --- \\
  var wordID = await db.getUserGameID(interaction.user.id, interaction.guild.id).catch(_ => { return -1; });
  if(wordID == -1) return interaction.reply({embeds: [embeds.error("You have to start a new game first. Type /new <id (optional)>")], ephemeral: true});
  // --- Split the word into array --- \\
  const word = getWord(wordID);
  var wordSplit = word.split("");

  // --- Check each guess --- \\
  const addGuess = await db.addGuess(interaction.user.id, guess, interaction.guild.id);
  var guesses = addGuess[0];
  var lastGuess = addGuess[1];
  var guessesDisplay = [];
  var letters = {
    "q": 1, "w": 1, "e": 1, "r": 1, "t": 1, "y": 1, "u": 1, "i": 1, "o": 1, "p": 1,
    "a": 1, "s": 1, "d": 1, "f": 1, "g": 1, "h": 1, "j": 1, "k": 1, "l": 1,
    "z": 1, "x": 1, "c": 1, "v": 1, "b": 1, "n": 1, "m": 1
  };
  let guessesAmount = 0;
  // --- Generate colors from each guess user has made --- \\
  guesses.forEach(eachGuess => {
    guessesAmount++;
    const split = eachGuess.toLowerCase().split("");
    var chars = {};
    var wordEmojis = "";
    wordSplit.forEach(element => {
      if(chars[element] == null){
        chars[element] = 1;
      }else{
        chars[element] += 1;
      }
    });
    var guessColors = [];
    //create colors
    split.forEach((element, index) => {
      wordEmojis += ":regional_indicator_"+element+":";
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
    guessesDisplay.push(finalColors);
    guessesDisplay.push(wordEmojis);
  });
  // --- Check if user guessed and send curresponding embed --- \\
  if(!lastGuess && guessesDisplay[guessesDisplay.length - 2] != "🟩🟩🟩🟩🟩"){
    interaction.reply({embeds: [embeds.guess(wordID, guessesAmount, guessesDisplay, interaction.user.id, letters)], ephemeral: true});
  }else{
    await db.clearGameData(interaction.user.id, interaction.guild.id);
    await db.saveStats(interaction.user.id, guessesDisplay.length, guessesDisplay[guessesDisplay.length - 2] == "🟩🟩🟩🟩🟩", interaction.guild.id);
    interaction.reply({embeds: [embeds.lastGuess(wordID, guessesDisplay, interaction.user.id, getWord(wordID), letters)], ephemeral: true, components: [playNewBtn]});
    interaction.channel.send({embeds: [embeds.result(wordID, guessesDisplay, interaction.user)], components: [interactions.playThisWordle]});
  }
}

stats = async (user, interaction, update = null) => {
  if(user == null){ user = interaction.user; }
  if(user.bot) return interaction.reply({embeds: [embeds.error("You can not get the stats of a bot!")], ephemeral: true});
  const data = await db.getStats(user.id, update).catch(_ => { return null; });
  if(!data) return interaction.reply({embeds: [embeds.error("This user unfortunatly doesn't have any stats yet!")], ephemeral: true});
  var totalgames = 0;
  var totalgamesfinished = 0;
  var gamesWon = 0;
  var tries = [0, 0, 0, 0, 0, 0, 0];
  var firstGame = data[0].timestamp;
  var lastGame = data[data.length - 1].timestamp;
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
  var embedData = [totalgames, totalgamesfinished, gamesWon, winrate, guessStatsDisplay, update, firstGame, lastGame];
  if(update == null){
    interaction.reply({embeds: [embeds.stats(user.id, user.avatarURL(), user.username, embedData)], components: [interactions.stats], ephemeral: false});
  }else{
    interaction.update({embeds: [embeds.stats(user.id, user.avatarURL(), user.username, embedData)], components: [interactions.stats], ephemeral: true});
  }
}

topServer = async (interaction) => {
  var type = "";
  var edit = false;
  if(interaction.isCommand()){
    type = "winrate";
  }else if(interaction.isSelectMenu()){
    var selection = interaction.values[0];
    edit = true;
    type = selection;
  }
  const server = interaction.guild;
  const data = await db.getTopPlayers(type, server.id).catch(_ => { return null });
  if(typeof data == Array){
    return interaction.reply({embeds: [embeds.error("This Server doesnt have any players yet!")], ephemeral: true});
  }
  if(!edit){
    return interaction.reply({embeds: [embeds.topServer(server, data, type)], components: [interactions.serverstats]});
  }
  interaction.update({embeds: [embeds.topServer(server, data, type)], components: [interactions.serverstats]})
}

getDailyID = () => {
  const firstDaily = new Date('2022-01-01');
  const dailyID = Math.round((Date.now() - firstDaily) / (24*60*60*1000));
  return dailyID;
}

daily = async (interaction) => {
  const dailyID = getDailyID();
  //check if user hasnt played it yet
  var today = new Date();
  var tomorrowUnix = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, 0);
  tomorrowUnix = tomorrowUnix / 1000;
  if(await db.checkPlayed(interaction.user.id, interaction.guild.id, dailyID)) return interaction.reply({embeds: [embeds.error(`You have already played this wordle.\nPlease come back in <t:${tomorrowUnix}:R>`)], ephemeral: true});
  //save the game & stats
  await db.saveID(interaction.user.id, dailyID, interaction.guild.id);
  await db.saveStats(interaction.user.id, -2, true, interaction.guild.id);
  interaction.reply({embeds: [embeds.daily(dailyID, interaction.user.id)], ephemeral: true});
}

module.exports = {
  newGame,
  guess,
  stats,
  topServer,
  daily
};