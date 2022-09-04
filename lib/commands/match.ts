import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import { UserError } from '../utils/errors.js';
import TEAMS from '../data/teams.js';

export default {
  data: new SlashCommandBuilder()
    .setName('match')
    .setDescription('Get live updates for a match')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('team')
        .setDescription('One of the teams that is playing')
        .setAutocomplete(true)
        .setRequired(true)
    ),
  async execute(
    interaction: ChatInputCommandInteraction | AutocompleteInteraction
  ) {
    // SlashCommand
    if (interaction.isChatInputCommand()) {
      // Validation -> is not in Thread
      const isThread = interaction.channel?.isThread();
      if (isThread) {
        throw new UserError('Cannot use command /match inside a thread');
      }

      // Validation -> team exists
      const teamName = interaction.options.getString('team', true);
      const team = TEAMS.filter((team) => team.name === teamName);
      if (team.length === 0) {
        throw new UserError(
          'Team does not exist.\nOnly teams from the Primeira Liga are supported for now'
        );
      }

      // Create thread
      const threadMessage = await interaction.reply({
        content: `Starting a Match thread...\n${team[0].name}`,
        fetchReply: true
      });
      threadMessage.startThread({
        name: `Match thread: ${team[0].name}`,
        autoArchiveDuration: 1440,
        reason: `Match thread for ${team[0].name}`
      });
      return;
    }

    // Autocomplete
    if (interaction.isAutocomplete()) {
      const focusedValue = interaction.options.getFocused();
      let choices = TEAMS.map((team) => team.name);
      if (focusedValue) {
        choices = choices.filter((choice) =>
          choice.toLowerCase().startsWith(focusedValue.toLowerCase())
        );
      }
      choices = choices.slice(0, 25); //Discord only allows 25 options at a time
      await interaction.respond(
        choices.map((choice) => ({ name: choice, value: choice }))
      );
    }
  }
};
