import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.reply('Pong!');
	},
};

module.exports = command;