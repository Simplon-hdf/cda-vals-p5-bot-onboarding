import {
    ActionRowBuilder,
    Client,
    Interaction,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    User,
    MessageFlags
} from "discord.js";

export async function identificationRequest(interaction: Interaction, client: Client) {
    // Checking if the interaction token still exists
    if (!interaction.token) return;

    
    // Replying to the identification request modal submission
    if (interaction.isStringSelectMenu() && interaction.customId === 'identificationRequest') {
        const staffIdentificationChannelId = process.env.RELAY_TARGET_CHANNEL;
        
        if (!staffIdentificationChannelId) {
            console.error("RELAY_TARGET_CHANNEL environment variable is not set.");
            return;
        }

        const guild = interaction.guild;
        if (!guild) {
            console.error("Interaction is not in a guild.");
            return;
        }

        const staffIdentificationChannel = await guild.channels.fetch(staffIdentificationChannelId);
        if (!staffIdentificationChannel || !staffIdentificationChannel.isTextBased()) {
            console.error("Staff identification channel is not a text channel or does not exist.");
            return;
        }

        // Checking if the bot has access to the channel
        let botMember = guild.members.me;

        if (!botMember) {
            try {
                botMember = await guild.members.fetchMe();
            } catch (err) {
                console.error("Failed to fetch bot member:", err);
                return;
            }
        }

        const promotion = interaction.values[0];

        const success = await staffIdentificationChannel.send(makeEmbed(interaction.user, promotion)).catch(error => {
            let reply = ":warning: Une erreur est survenue lors de l'envoi de la demande.";
            let consoleMessage = "Failed to send message in staff identification channel: " + error;

            switch (error.code) {
                case 50001: // Can't access
                    consoleMessage = "Bot is missing permissions to see the staff identification channel.";
                    reply = ":warning: Je n'ai pas les permissions nécessaires pour envoyer la demande (voir le canal), contacter un administrateur.";
                    break;

                case 50013: // Can't send messages
                    consoleMessage = "Bot is missing permissions to write the staff identification channel.";
                    reply = ":warning: Je n'ai pas les permissions nécessaires pour envoyer la demande (écrire dans le canal), contacter un administrateur.";
                    break;
                }

            console.error(`[ERROR] ${consoleMessage}`);
            interaction.reply({ content: reply, flags: [MessageFlags.Ephemeral] }).catch(console.error);

            return;
        });

        if (success) {
            await interaction.reply({
                content: `La demande a bien été effectuée.`,
                flags: [MessageFlags.Ephemeral]
            });
        }
    }

    // Showing the modal when the button is clicked
    if (interaction.isButton() && interaction.customId === "identificationButton") {
        console.log("Identification button clicked, showing menu.");
        const promos = await getPromos();

        const options = promos.map(promo => ({
            label: promo.nom,
            value: promo.id,
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('identificationRequest')
            .setPlaceholder('Sélectionne ta promo')
            .addOptions(options as any);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
            content: 'Choisis ta promo ci-dessous :',
            components: [row as any],
            ephemeral: true
        });
    }
}



// TODO: Replace this with a real API call to fetch promotions
// This is a mock function to simulate fetching promotions from a database or API.
function getPromos() {
    return [
        {id: "1", nom: "Promotion 1", identification: [], idStatut: 1, statut: "A commencer", timestampDebut: 1700000000, timestampFin: 1700000000},
        {id: "2", nom: "Promotion 2", identification: [], idStatut: 2, statut: "En cours", timestampDebut: 1700000000, timestampFin: 1700000000},
        {id: "3", nom: "Promotion 3", identification: [], idStatut: 3, statut: "Terminée", timestampDebut: 1700000000, timestampFin: 1700000000}, 
    ]
}

function getPromo(id: string) {
    const promos = getPromos();
    return promos.find(promo => promo.id === id);
}


// TODO: Should get the user's first and last name from the database
function makeEmbed(author: User, promotion: string): { embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder>[], content: string } {
    const embed: EmbedBuilder = new EmbedBuilder()
        .setColor(0xf01020)
        .setDescription(`[Nom] [Prénom] a demandé de rejoindre la promotion ${getPromo(promotion)?.nom || "Inconnu"}.`)
        .setAuthor({
            name: `${author.displayName} (@${author.tag})`,
            iconURL: author.displayAvatarURL(),
        })
        .setFooter({ text: "Cliquer sur un des boutons ci-dessous pour valider ou refuser la demande." })
        .setTimestamp(Date.now());

    const buttons: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('acceptIdentification')
            .setLabel('Accepter la demande')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('rejectIdentification')
            .setLabel('Refuser la demande')
            .setStyle(ButtonStyle.Danger)
    );

    return { embeds: [embed], components: [buttons], content: `${author} a demandé une identification.`  }
}
