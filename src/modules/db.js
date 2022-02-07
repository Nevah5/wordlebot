const fs = require("fs");
const image = {"games":[], "stats":[]};

const checkDB = () =>{
  if(!fs.existsSync("./db.json")){
    fs.writeFileSync('./db.json', '{"games":[], "stats":[]}');
  }
}
const saveID = (userID, id) => {
  checkDB();
  const file = fs.readFileSync('./db.json').toString();
  var db = JSON.parse(file);
  var found = false;
  var newDB = image;
  db.games.forEach(element => {
    for(var [key, val] of Object.entries(element)){
      if(key == userID){
        newDB.games.push({[key]: {"id": id}});
        found = true;
      }else{
        newDB.games.push({[key]: val});
      }
    }
  });
  if(!found){
    newDB.games.push({[userID]: {"id": id}});
  }
  fs.writeFileSync('./db.json', JSON.stringify(newDB), null, 2);
}
const getUserGameID = (userID) => {
  checkDB();
  var file = fs.readFileSync('db.json').toString();
  var db = JSON.parse(file);
  db.games.forEach(element => {
    for(const [key, val] of Object.entries(element)){
      if(key == userID){
        wordID = val.id;
      }
    }
  });
  return wordID;
}
const addGuess = (userID, guess) => { //adds guess and returns all guesses
  checkDB();
  var file = fs.readFileSync('./db.json').toString();
  var db = JSON.parse(file);
  var newDB = image;
  var guesses = [];
  var lastGuess = false;
  // --- Update DB with new guess --- \\
  db.games.forEach(element => {
    for(const [key, val] of Object.entries(element)){
      if(key == userID){
        if(val.guesses == null){
          val.guesses = [guess];
        }else{
          if(val.guesses.length == 5){
            lastGuess = true;
          }
          val.guesses.push(guess);
        }
        guesses = val.guesses;
        newDB.games.push({[userID]: {"id": wordID, "guesses": val.guesses}});
      }else{
        newDB.games.push({[key]: val});
      }
    }
  });
  fs.writeFileSync('./db.json', JSON.stringify(newDB), null, 2);
  return [guesses, lastGuess];
}
const clearGameData = (userID) => {
  checkDB();
  var file = fs.readFileSync('./db.json').toString();
  var db = JSON.parse(file);
  var newDB = image;
  db.games.forEach(element => {
    for(const [key, val] of Object.entries(element)){
      if(key != userID){
        newDB.games.push({[key]: val});
      }
    }
  });
  fs.writeFileSync('./db.json', JSON.stringify(newDB), null, 2);
}

module.exports = {
  saveID,
  getUserGameID,
  addGuess,
  clearGameData
}