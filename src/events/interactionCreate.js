import { getEmoji } from '../handlers/emoji.js';
import {
  handleLinkModal,
  handleLinkPromptButton
} from '../commands/questCommands.js';

const DM_ALLOWED_USERS = [
  "1531806653203091608",
  "1413268695160983582",
  "YOUR_DISCORD_ID_3",
  "YOUR_DISCORD_ID_4",
  "YOUR_DISCORD_ID_5"
];

const DM_WARNING = `# you are not owner special <a:Xieron_stolen_emoji_1784269191:1559410504852578374>

**You don’t have access to this command.**
Run it in the server instead.

<:emoji_73:1559248968465129543> <https://discord.com/channels/1559194966574637167/1559273285924028557>`;

export default {
  name: 'interactionCreate',
  once: false,

  async execute(interaction, client) {

    // Block slash commands in DMs for non-allowed users
    if (
      interaction.isChatInputCommand() &&
      !interaction.guildId &&
      !DM_ALLOWED_USERS.includes(interaction.user.id)
    ) {
      await interaction.reply({
        content: DM_WARNING
      }).catch(() => {});
      return;
    }

    // Modal: link token
    if (
      interaction.isModalSubmit() &&
      interaction.customId === 'link_token_modal'
    ) {
      await handleLinkModal(interaction, client);
      return;
    }

    // Button: link_prompt
    if (
      interaction.isButton() &&
      interaction.customId === 'link_prompt'
    ) {
      await handleLinkPromptButton(interaction);
      return;
    }

    // Slash commands
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);

      const msg = {
        content: `${getEmoji('error')} Something went wrong.`,
        flags: 64
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg).catch(() => {});
      } else {
        await interaction.reply(msg).catch(() => {});
      }
    }
  },
};
