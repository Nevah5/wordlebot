const { words } = require("./words");
const embeds = require("./embeds");
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

module.exports = {
  newGame
};