const fs = require("fs");
const mysql = require("mysql");
const { lastGuess } = require("./embeds");
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
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM games WHERE userID="${userID}"`, (err, results) => {
      if(results.length == 0) reject();
      resolve(results[0].gameID);
    });
  });
}
const addGuess = (userID, guess) => { //adds guess and returns all guesses
  return new Promise((resolve, reject) => {
    con.query(`INSERT INTO guesses VALUES (null, "${userID}", "${guess}")`);
    con.query(`SELECT guess FROM guesses WHERE userID="${userID}"`, (err, results) => {
      var guesses = [];
      results.forEach(result => {
        guesses.push(result.guess);
      });
      resolve([guesses, results.length == 6]);
    });
  });
}
const clearGameData = (userID) => {
  return new Promise((resolve, reject) => {
    con.query(`DELETE FROM games WHERE userID="${userID}"`);
    con.query(`DELETE FROM guesses WHERE userID="${userID}"`);
  });
}

module.exports = {
  saveID,
  getUserGameID,
  addGuess,
  clearGameData
}