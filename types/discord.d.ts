import { Collection } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, SimplifiedCommand>;
  }

  export interface SimplifiedCommand {
    name: string;
    execute: (
      interaction: CommandInteraction | AutocompleteInteraction
    ) => Promise<void>;
  }
}
