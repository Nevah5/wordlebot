const { MessageEmbed } = require("discord.js");

const example = (msgContent) => {
  return new MessageEmbed()
    .setTitle("Test")
    .setDescription(msgContent);
}
module.exports = {
  example
};