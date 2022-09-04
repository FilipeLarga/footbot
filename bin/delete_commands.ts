import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { CLIENTID, TOKEN } from '../config.js';

const rest = new REST().setToken(TOKEN);

rest
  .put(Routes.applicationCommands(CLIENTID), { body: [] })
  .then(() => console.log('Successfully deleted application commands.'))
  .catch(console.error);
