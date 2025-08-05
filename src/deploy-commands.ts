// Environement variables
import dotenv from 'dotenv';
dotenv.config();

import { REST, Routes } from 'discord.js';
// const { clientId, guildId, token } = require('./config.json');
import fs from 'node:fs';
import path from 'node:path';

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
console.log("Loading commands in directory:", foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
	console.log(`> Loading commands from folder: ${folder}`);

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		console.log(`-> Loading command file: ${file}`);

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
if (!process.env.DISCORD_TOKEN) {
	throw new Error('DISCORD_TOKEN environment variable is not set.');
}
const rest = new REST().setToken(process.env.DISCORD_TOKEN as string);

if (!process.env.DISCORD_CLIENT_ID) {
	throw new Error('DISCORD_CLIENT_ID environment variable is not set.');
}

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${(data as any[]).length} application (/) commands.`);
	} catch (error: unknown) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
