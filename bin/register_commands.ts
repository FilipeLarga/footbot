import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { CLIENTID, TOKEN } from '../config.js';

const commands = [];
const commandsPath = new URL('../lib/commands', import.meta.url).pathname;
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith('.js')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const { default: command } = await import(filePath);
  commands.push(command.data.toJSON());
}

if (commands.length === 0) {
  throw new Error('No commands found to deploy');
}

const rest = new REST().setToken(TOKEN);
rest
  .put(Routes.applicationCommands(CLIENTID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
