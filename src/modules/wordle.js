const { words } = require("./words");
const embeds = require("./embeds");
const fs = require("fs");

getWord = (id) => {
  return words[id];
}

newGame = (id, interaction) => {
  if(id != null){
    // --- Test if user inputted invalid id --- \\
    if(!/[0-9]+/.test(id)) return interaction.reply({embeds: [embeds.error("Please specify the ID as a number between 1 and "+words.length+".")], ephemeral: true});
    if(id > words.length || id < 1) return interaction.reply({embeds: [embeds.error("This ID is invalid. [1-"+words.length+"]")], ephemeral: true});
  }else{
    id = Math.floor(Math.random() * (words.length - 1));
  }
  if(!fs.existsSync("./db.json")){
    fs.writeFileSync('./db.json', '{"users":[]}');
  }
  // --- Save ID to database --- \\
  const file = fs.readFileSync('./db.json').toString();
  var db = JSON.parse(file);
  var found = false;
  var newDB = {"users":[]};
  db.users.forEach(element => {
    for(var [key, val] of Object.entries(element)){
      if(key == interaction.user.id){
        newDB.users.push({[key]: {"id": id}});
        found = true;
      }else{
        newDB.users.push({[key]: val});
      }
    }
  });
  if(!found){
    newDB.users.push({[interaction.user.id]: {"id": id}});
  }
  fs.writeFileSync('./db.json', JSON.stringify(newDB), null, 2);
  interaction.reply({embeds: [embeds.newGame(id, interaction.user.id)], ephemeral: true});
}

guess = (guess, msg) => {
  // --- Validate guess --- \\
  if(!/^[a-z]{5}$/.test(guess.toLowerCase())) return msg.reply({embeds: [embeds.error("This guess is invalid. [Please use 5 letter words to guess]")]});
  if(!words.includes(guess)) return msg.reply({embeds: [embeds.error("Please guess a valid word.")]});

  // --- Get the word ID from database --- \\
  var wordID = -1;
  var file = fs.readFileSync('db.json');
  var db = JSON.parse(file);
  db.users.forEach(element => {
    for(const [key, val] of Object.entries(element)){
      if(key == msg.author.id){
        wordID = val.id;
      }
    }
  });
  if(wordID == -1) return msg.reply({embeds: [embeds.error("You have to start a new game first. Type /new <id (optional)>")]});
  // --- Split the word into array --- \\
  const word = getWord(wordID);
  var wordSplit = word.split("");

  // --- Check each guess --- \\
  var file = fs.readFileSync('./db.json');
  var db = JSON.parse(file);
  var newDB = {"users": []};
  var guesses = [];
  var lastGuess = false;
  // --- Update DB with new guess --- \\
  db.users.forEach(element => {
    for(const [key, val] of Object.entries(element)){
      if(key == msg.author.id){
        if(val.guesses == null){
          val.guesses = [guess];
        }else{
          if(val.guesses.length == 5){
            lastGuess = true;
          }
          val.guesses.push(guess);
        }
        guesses = val.guesses;
        newDB.users.push({[msg.author.id]: {"id": wordID, "guesses": val.guesses}});
      }else{
        newDB.users.push({[key]: val});
      }
    }
  });
  fs.writeFileSync('./db.json', JSON.stringify(newDB), null, 2);
  var guessesColors = [];
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
    msg.reply({embeds: [embeds.guess(wordID, guesses, guessesColors, msg.author.id)]});
  }else{
    // --- Clear user's data from DB --- \\
    var file = fs.readFileSync('./db.json').toString();
    var db = JSON.parse(file);
    var newDB = {"users":[]};
    db.users.forEach(element => {
      for(const [key, val] of Object.entries(element)){
        if(key != msg.author.id){
          newDB.users.push({[key]: val});
        }
      }
    });
    fs.writeFileSync('./db.json', JSON.stringify(newDB), null, 2);
    msg.reply({embeds: [embeds.lastGuess(wordID, guesses, guessesColors, msg.author.id, getWord(wordID))]});
  }
}

module.exports = {
  newGame,
  guess
};