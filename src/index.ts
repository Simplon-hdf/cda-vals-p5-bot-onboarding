// Environement variables
import dotenv from 'dotenv';
dotenv.config();

// File system and path modules to autoload commands
import fs from 'node:fs';
import path from 'node:path';

// Require the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits, MessageFlags, ChatInputCommandInteraction } from 'discord.js';

// Extend the Client class to include a commands property
interface Command {
	data: { name: string };
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}


// Create a new client instance
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
] });

// Create a new collection to store commands
const commands: Collection<string, Command> = new Collection();


// Auto-load commands from the commands directory and their subdirectories
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
console.log("Loading commands in directory:", foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.ts'));
	console.log(`> Loading commands from folder: ${folder}`);
	
	for (const file of commandFiles) {
		console.log(`-> Loading command file: ${file}`);

		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Auto-load the event handlers
// TODO: Maybe find a way to make autoload a function, to reuse it in the future
const eventsPath = path.join(__dirname, "events");
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"))) {
	console.log(`Loading event: ${file}`);
	// Dynamically import the event file
	const event = require(path.join(eventsPath, file));
	if (event.once) {
		console.log(`Registering once event: ${event.name}`);
		client.once(event.type, (...args) => event.execute(...args, client));
	} else {
		console.log(`Registering event: ${event.name}`);
		client.on(event.type, (...args) => event.execute(...args, client));
	}
}



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});


// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
