const { words } = require("./words");
const fs = require("fs");

getWord = (id = Math.floor(Math.random() * (words.length - 1))) => {
  return words[id];
}

newGame = (id, msg) => {
  if(!/[0-9]+/.test(id)){
    msg.reply("Please specify the ID as a number between 1 and "+words.length+".");
    return;
  }
  if(id > words.length || id < 1){
    msg.reply("This ID is invalid. [1-"+words.length+"]");
    return;
  }
  if(!fs.existsSync("./db.json")){
    fs.writeFileSync('./db.json', '{"users":[]}');
  }
}

module.exports = {
  newGame
};