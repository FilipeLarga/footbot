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
    if (interaction.isChatInputCommand()) {
      // Validation -> is in Thread
      const isThread = interaction.channel?.isThread();
      if (isThread) {
        throw new UserError('Cannot be inside a thread');
      }

      await interaction.reply('ok buddy');
      return;
    }

    if (interaction.isAutocomplete()) {
      const focusedValue = interaction.options.getFocused();
      const choices = TEAMS.map((team) => team.name);
      const filtered = choices.filter((choice) =>
        choice.startsWith(focusedValue)
      );
      filtered.length = 25; //Discord only allows 25 options at a time
      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }
  }
};
