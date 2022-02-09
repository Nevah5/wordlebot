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
  return new Promise((resolve) => {
    con.query(`DELETE FROM games WHERE userID="${userID}"`);
    con.query(`DELETE FROM guesses WHERE userID="${userID}"`);
    con.query(`INSERT INTO games VALUES (null, "${userID}", ${id})`);
    resolve();
  });
}
const getUserGameID = (userID) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM games WHERE userID="${userID}"`, (err, results) => {
      if(results.length == 0) return reject();
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
    resolve();
  });
}
const saveStats = (userID, numGuesses, hasFinished) => {
  return new Promise((resolve, reject) => {
    numGuesses = !hasFinished ? -1 : numGuesses;
    con.query(`INSERT INTO stats VALUES (null, "${userID}", ${numGuesses}, default)`);
    resolve();
  });
}
const getStats = (userID, time) => {
  return new Promise((resolve, reject) => {
    if(time == null || time == "LIFETIME"){
      con.query(`SELECT * FROM stats WHERE userID="${userID}"`, (err, results) => {
        if(results.length == 0) return reject();
        resolve(results);
      });
    }else{

      con.query(`SELECT * FROM stats WHERE userID="${userID}" AND timestamp > (NOW() - INTERVAL ${time}) ORDER BY timestamp`, (err, results) => {
        if(results.length == 0) return reject();
        resolve(results);
      });
    }
  });
};

module.exports = {
  saveID,
  getUserGameID,
  addGuess,
  clearGameData,
  saveStats,
  getStats
}