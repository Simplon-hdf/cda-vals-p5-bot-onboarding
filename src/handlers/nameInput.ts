import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, Client, Interaction, RestOrArray } from "discord.js";

export async function nameInput(interaction: Interaction, client: Client) {
    if (interaction.isModalSubmit() && interaction.customId === 'user_info_modal') {
        const nom = interaction.fields.getTextInputValue('last_name');
        const prenom = interaction.fields.getTextInputValue('first_name');

        // Tu peux ensuite enregistrer ça en BDD ou autre
        await interaction.reply({
            content: `Merci, ${prenom} ${nom} ! Tes infos ont été enregistrées.`,
            ephemeral: true
        });
    }

    // Dans ton interactionCreate.js ou équivalent
    if (interaction.isButton() && interaction.customId === 'complete_info') {
        const modal = new ModalBuilder()
            .setCustomId('user_info_modal')
            .setTitle('Remplis tes infos');

        const nomInput = new TextInputBuilder()
            .setCustomId('last_name')
            .setLabel('Ton nom')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const prenomInput = new TextInputBuilder()
            .setCustomId('first_name')
            .setLabel('Ton prénom')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const row1 = new ActionRowBuilder().addComponents(nomInput);
        const row2 = new ActionRowBuilder().addComponents(prenomInput);

        modal.addComponents(row1 as any, row2);
        await interaction.showModal(modal);
    }
}

