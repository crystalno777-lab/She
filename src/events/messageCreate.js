import { getEmoji } from '../handlers/emoji.js';
import { PREFIX } from '../utils/config.js';

const DM_ALLOWED_USERS = [
  "1531806653203091608",
  "1413268695160983582",
  "YOUR_DISCORD_ID_3",
  "YOUR_DISCORD_ID_4",
  "YOUR_DISCORD_ID_5"
];

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
      await message.reply(
        '# you are not owner special\ngo and run this command\n<:emoji_76:1559248965898080397> <https://discord.com/channels/1559194966574637167/1559273285924028557>'
      ).catch(() => {});
      return;
    }

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.prefixExecute(message, args, client);
    } catch (err) {
      console.error(err);
      await message.reply(`${getEmoji('error')} Something went wrong.`).catch(() => {});
    }
  },
};
