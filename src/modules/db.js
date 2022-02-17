const fs = require("fs");
const mysql = require("mysql");
const { resolve } = require("path");
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});
con.connect();

const saveID = (userID, id, guildID) => {
  return new Promise((resolve) => {
    // --- START NEW GAME --- \\
    con.query(`DELETE FROM currentgames WHERE guildID="${guildID}" AND userID="${userID}"`);
    con.query(`DELETE FROM guesses WHERE guildID="${guildID}" AND userID="${userID}"`);
    con.query(`INSERT INTO currentgames VALUES (null, "${guildID}", "${userID}", ${id}, default)`);
    con.query(`INSERT INTO gamesplayed VALUES (null, "${guildID}", "${userID}", ${id}, default)`);
    con.query(`SELECT * FROM rankings WHERE userID="${userID}" AND guildID="${guildID}"`, (err, results) => {
      if(results.length != 0){ //creating a tuple for this user in saveStats()
        const started = results[0].started + 1;
        con.query(`UPDATE rankings SET started=${started} WHERE userID="${userID}" AND guildID="${guildID}"`);
      }
    });
    resolve();
  });
}
const checkPlayed = (userID, guildID, gameID) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM gamesplayed WHERE userID="${userID}" AND guildID="${guildID}" AND gameID=${gameID}`, (err, results) => {
      resolve(results.length == 0);
    });
  });
}
const getAmountPlayed = (userID, guildID) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM gamesplayed WHERE userID="${userID}" AND guildID="${guildID}"`, (err, results) => {
      resolve(results.length);
    });
  });
}
const getUserGameID = (userID, guildID) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM currentgames WHERE userID="${userID}" AND guildID="${guildID}"`, (err, results) => {
      if(results.length == 0) return reject();
      resolve(results[0].gameID);
    });
  });
}
const addGuess = (userID, guess, guildID) => { //adds guess and returns all guesses
  return new Promise((resolve, reject) => {
    con.query(`INSERT INTO guesses VALUES (null, "${guildID}", "${userID}", "${guess}")`);
    con.query(`SELECT guess FROM guesses WHERE guildID="${guildID}" AND userID="${userID}"`, (err, results) => {
      var guesses = [];
      results.forEach(result => {
        guesses.push(result.guess);
      });
      // --- SERVER RANKINGS --- \\
      con.query(`SELECT * FROM rankings WHERE userID="${userID}" AND guildID="${guildID}"`, (err, results) => {
        if(results.length == 0){
          con.query(`INSERT INTO rankings VALUES (null, "${guildID}", "${userID}", 1, 0, 0, 1, null)`);
        }else{
          const newGuesses = results[0].numGuesses + 1;
          con.query(`UPDATE rankings SET numGuesses=${newGuesses} WHERE userID="${userID}" AND guildID="${guildID}"`);
        }
      });
      resolve([guesses, results.length == 6]);
    });
  });
}
const clearGameData = (userID, guildID) => {
  return new Promise((resolve, reject) => {
    con.query(`DELETE FROM currentgames WHERE userID="${userID}" AND guildID="${guildID}"`);
    con.query(`DELETE FROM guesses WHERE userID="${userID}" AND guildID="${guildID}" AND guildID="${guildID}"`);
    resolve();
  });
}
const saveStats = (userID, numGuesses, hasFinished, guildID) => {
  return new Promise((resolve, reject) => {
    numGuesses = !hasFinished ? -1 : numGuesses;
    con.query(`INSERT INTO stats VALUES (null, "${userID}", ${numGuesses}, default)`);
    // --- SERVER RANKINGS --- \\
    con.query(`SELECT * FROM rankings WHERE userID="${userID}" AND guildID="${guildID}"`, (err, results) => {
      if(results.length == 0){
        con.query(`INSERT INTO rankings VALUES (null, "${guildID}", "${userID}", 1, 0, 0, 0, null)`);
      }else{
        if(numGuesses != -2){
          const hasWon = hasFinished ? 1 : 0;
          const won = results[0].won + hasWon;
          const finished = results[0].finished + 1;
          con.query(`UPDATE rankings SET won=${won}, finished=${finished} WHERE userID="${userID}" AND guildID="${guildID}"`);
        }
      }
    });
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

const getTopPlayers = (type, guildID) => {
  return new Promise((resolve, reject) => {
    if(type == "winrate"){
      con.query(
        `SELECT * FROM rankings WHERE guildID="${guildID}" ORDER BY (100 / started * won) DESC LIMIT 5`,
        (err, results) => {
          if(results.length == 0) return resolve("nodata");
          resolve(results);
        }
      );
    }else if(type == "finished"){
      con.query(
        `SELECT * FROM rankings WHERE guildID="${guildID}" ORDER BY finished DESC LIMIT 5`,
        (err, results) => {
          if(results.length == 0) return resolve("nodata");
          resolve(results);
        }
      );
    }else if(type == "guesses"){
      con.query(
        `SELECT * FROM rankings WHERE guildID="${guildID}" ORDER BY numGuesses DESC LIMIT 5`,
        (err, results) => {
          if(results.length == 0) return resolve("nodata");
          resolve(results);
        }
      );
    }else if(type == "started"){
      con.query(
        `SELECT * FROM rankings WHERE guildID="${guildID}" ORDER BY started DESC LIMIT 5`,
        (err, results) => {
        if(results.length == 0) return resolve("nodata");
          resolve(results);
        }
      );
    }else if(type == "won"){
      con.query(
        `SELECT * FROM rankings WHERE guildID="${guildID}" ORDER BY won DESC LIMIT 5`,
        (err, results) => {
        if(results.length == 0) return resolve("nodata");
          resolve(results);
        }
      );
    }
  })
}

module.exports = {
  saveID,
  checkPlayed,
  getAmountPlayed,
  getUserGameID,
  addGuess,
  clearGameData,
  saveStats,
  getStats,
  getTopPlayers
}