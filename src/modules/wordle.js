const { words } = require("./words");

getWord = () => {
  return words[Math.floor(Math.random() * (words.length - 1))];
}

module.exports = {
  getWord
};