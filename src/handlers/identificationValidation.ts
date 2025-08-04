import { Interaction, Client, TextChannel, APIEmbed, ButtonInteraction, MessageFlags } from "discord.js";

import wait from 'node:timers/promises'

export async function identificationValidation(interaction: Interaction, client: Client) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'acceptIdentification') {
        // TODO: Call the backend API to accept the identification request
		await interaction.reply({
			content: '✅ Demande acceptée.',
			flags: [MessageFlags.Ephemeral],
		});

        await editEmbed(
            interaction,
            0x00f020,
            `✅ Demande acceptée par ${interaction.user.tag}`,
        );

	} else if (interaction.customId === 'rejectIdentification') {
        // TODO: Call the backend API to reject the identification request
		await interaction.reply({
			content: '❌ Demande refusée.',
			flags: [MessageFlags.Ephemeral],
		});

        await editEmbed(
            interaction,
            0xf01010,
            `❌ Demande refusée par ${interaction.user.tag}`,
        );

	} else { return; }

    // await interaction.message.delete(); // Original message
    await wait.setTimeout(10000); // Wait for 10 seconds before deleting the reply message
    await interaction.deleteReply();
}


async function editEmbed(interaction: ButtonInteraction, color: number, footerText: string): Promise<APIEmbed> {
    let editedEmbed = {
        ...interaction.message.embeds[0].toJSON(),
        color: color,
        footer: {
            text: footerText
        }
    };
    
    interaction.message.edit(
        { 
            content: `-# La demande de ${interaction.message.mentions.users.first()} a été traitée par ${interaction.user}`,
            embeds: [editedEmbed],
            components: [],
        }
    );

    return editedEmbed;
}
