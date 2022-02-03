const { MessageEmbed } = require("discord.js");

const playerGuess = (id, guess) => {
  return new MessageEmbed()
  .setTitle("Your wordle #"+id)
	.setURL('https://www.powerlanguage.co.uk/wordle/')
  .setAuthor({ name: "Discord Wordle", iconURL: "", url: "https://github.com/nevah5/wordlebot"})
  .addField("Your guesses:", guess, true)
  .setFooter({text: "1 guess left, guess with /guess <YOUR_GUESS>"})
  .setColor("#6AAA64");
}
module.exports = {
  playerGuess
};