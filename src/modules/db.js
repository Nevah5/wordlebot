const fs = require("fs");
const mysql = require("mysql");
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});
con.connect();

const saveID = (userID, id) => {
  con.query(`DELETE FROM games WHERE userID="${userID}"`);
  con.query(`DELETE FROM guesses WHERE userID="${userID}"`);
  con.query(`INSERT INTO games VALUES (null, "${userID}", ${id})`);
}
const getUserGameID = (userID) => {
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
  var file = fs.readFileSync('./db.json').toString();
  var db = JSON.parse(file);
  var newDB = {"games":[]};
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
  fs.writeFileSync('./db.json', JSON.stringify(newDB, null, 2));
  return [guesses, lastGuess];
}

module.exports = {
  saveID,
  getUserGameID,
  addGuess
}