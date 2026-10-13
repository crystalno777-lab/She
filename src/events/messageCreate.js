import { getEmoji } from '../handlers/emoji.js';
import { PREFIX } from '../utils/config.js';

const DM_ALLOWED_USERS = [
"1531806653203091608",
"1413268695160983582",
"YOUR_DISCORD_ID_3",
"YOUR_DISCORD_ID_4",
"YOUR_DISCORD_ID_5"
];

const DM_WARNING = {
embeds: [
{
color: 0x5865F2,
title: 'U AIN’T OWNER SPECIAL',
description:
'You don’t have access to this command.\nPlease run it in the server instead.',
footer: {
text: 'Quest Bot • Restricted DM Access'
}
}
],
components: [
{
type: 1,
components: [
{
type: 2,
style: 5,
label: 'Go to the channel',
url: 'https://discord.com/channels/1559194966574637167/1559273285924028557',
emoji: {
id: '1559248968465129543',
name: 'emoji_73'
}
}
]
}
]
};

export default {
name: 'messageCreate',
once: false,

async execute(message, client) {
if (message.author.bot) return;
if (!message.content.startsWith(PREFIX)) return;

if (
  !message.guild &&
  !DM_ALLOWED_USERS.includes(message.author.id)
) {
  await message.reply(DM_WARNING).catch(() => {});
  return;
}

const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
const commandName = args.shift()?.toLowerCase();
if (!commandName) return;

const command = client.prefixCommands.get(commandName);
if (!command) return;

try {
  await command.prefixExecute(message, args, client);
} catch (err) {
  console.error(err);
  await message.reply(
    `${getEmoji('error')} Something went wrong.`
  ).catch(() => {});
}

},
};
