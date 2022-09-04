import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  Client,
  Collection,
  SimplifiedCommand,
  GatewayIntentBits
} from 'discord.js';
import { TOKEN } from '../config.js';
import { UserError } from './utils/errors.js';

console.log('Starting Footbot...');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});
client.commands = new Collection<string, SimplifiedCommand>();
const commandsPath = new URL('commands', import.meta.url).pathname;
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith('.js')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const { default: commandImport } = await import(filePath);
  const command: SimplifiedCommand = {
    name: commandImport.data.name,
    execute: commandImport.execute
  };
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Footbot is ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isAutocomplete())
    return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (e) {
    let errorMessage;
    if (e instanceof UserError) {
      errorMessage = e.message;
    } else {
      errorMessage = 'There was an error while executing this command!';
      console.log(e);
    }
    if (interaction.isChatInputCommand()) {
      await interaction.reply({
        content: errorMessage,
        ephemeral: true
      });
    }
  }
});

client.login(TOKEN);
