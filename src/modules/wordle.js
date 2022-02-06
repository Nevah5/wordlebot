const { words } = require("./words");
const embeds = require("./embeds");
const fs = require("fs");

getWord = (id) => {
  return words[id];
}

newGame = (id, msg) => {
  if(id != null){
    if(!/[0-9]+/.test(id)) return msg.reply("Please specify the ID as a number between 1 and "+words.length+".");
    if(id > words.length || id < 1) return msg.reply("This ID is invalid. [1-"+words.length+"]");
  }else{
    id = Math.floor(Math.random() * (words.length - 1));
  }
  if(!fs.existsSync("./db.json")){
    fs.writeFileSync('./db.json', '{"users":[]}');
  }
  const file = fs.readFileSync('./db.json').toString();
  var db = JSON.parse(file);
  var found = false;
  var newDB = {"users":[]};
  db.users.forEach(element => {
    for(var [key, val] of Object.entries(element)){
      if(key == msg.author.id){
        newDB.users.push({[key]: {"id": id}});
        found = true;
      }else{
        newDB.users.push({[key]: val});
      }
    }
  });
  if(!found){
    newDB.users.push({[msg.author.id]: {"id": id}});
  }
  fs.writeFileSync('./db.json', JSON.stringify(newDB), null, 2);
  msg.reply({embeds: [embeds.newGame(id, msg.author.id)]});
}

guess = (guess, msg) => {
  if(!/^[a-z]{5}$/.test(guess)) return msg.reply("This guess is invalid. [Please use 5 letter words to guess]");
  const split = guess.split("");

  //get users word id
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
  if(wordID == -1) return msg.reply("You have to start a new game first. Type /new <id (optional)>");
  const word = getWord(wordID);
  var wordSplit = word.split("");
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
    guessColors[index] = chars[element] == null ? "⬛" : chars[element];
  });
  var finalColors = "";
  guessColors.forEach(element => {
    finalColors += element;
  });
  var file = fs.readFileSync('./db.json');
  var db = JSON.parse(file);
  var newDB = {"users": []};
  db.users.forEach(element => {
    for(const [key, val] of Object.entries(element)){
      if(key == msg.author.id){
        if(val.guesses == null){
          val.guesses = [guess];
        }else{
          val.guesses.push(guess);
        }
        newDB.users.push({[msg.author.id]: {"id": wordID, "guesses": val.guesses}});
      }else{
        newDB.users.push({[key]: val});
      }
    }
  });
  fs.writeFileSync('./db.json', JSON.stringify(newDB), null, 2);
  console.log(finalColors);
  msg.reply({embeds: [embeds.guess(wordID, [guess], [finalColors], msg.author.id)]});
}

module.exports = {
  newGame,
  guess
};