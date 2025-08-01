import { Interaction, Client, TextChannel } from "discord.js";

import wait from 'node:timers/promises'

export async function identificationValidation(interaction: Interaction, client: Client) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'acceptIdentification') {
        // TODO: Call the backend API to accept the identification request
		await interaction.reply({
			content: '✅ Demande acceptée.',
			ephemeral: true,
		});

        await interaction.message.delete(); // Original message
        await wait.setTimeout(2000); // Wait for 2 seconds before deleting the reply message
        await interaction.deleteReply();

	} else if (interaction.customId === 'rejectIdentification') {
        // TODO: Call the backend API to reject the identification request
		await interaction.reply({
			content: '❌ Demande refusée.',
			ephemeral: true,
		});

        await interaction.message.delete(); // Original message
        await wait.setTimeout(2000); // Wait for 2 seconds before deleting the reply message
        await interaction.deleteReply();
	}
}
