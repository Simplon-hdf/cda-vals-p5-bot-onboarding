import { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction) => Promise<void>;
}

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('makewelcome')
		.setDescription('Créé le message (et bouton) de bienvenue'),
	async execute(interaction: CommandInteraction): Promise<void> {
		const boutonInfos = new ButtonBuilder()
        .setCustomId('complete_info')
        .setLabel('Compléter mes infos')
        .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(boutonInfos);

        await interaction.reply({
            content: 'Bienvenue ! Clique ici pour compléter tes infos :',
            components: [row as any],
        });
	},
};

module.exports = command;


