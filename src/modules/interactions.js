const { MessageSelectMenu, MessageActionRow } = require("discord.js");

exports.stats = new MessageActionRow()
.addComponents(
  new MessageSelectMenu()
  .setCustomId('stattimeline')
  .setPlaceholder('Lifetime')
  .addOptions([
    {label: 'Today', description: 'The stats of this user from today.', value: 'today'},
    {label: 'Last Week', description: 'The stats of this user since last week.', value: 'lastweek'},
    {label: 'Lifetime', description: 'The lifetime stats of this user.', value: 'lifetime'}
  ])
);