import { Message, Client, TextChannel, EmbedBuilder, ContainerBuilder, ButtonStyle, MessageFlags, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { ConfigManager } from "../config/ConfigManager";

export async function handleRelay(message: Message, client: Client) {
	const fromChannelId = ConfigManager.config?.salonIdentificationId;
	const toChannelId = ConfigManager.config?.salonIdentificationStaffId;

	if (!fromChannelId || !toChannelId) {
		console.error("[messageRelay] Source or destination channel ID is not set. (salonIdentificationId or salonIdentificationStaffId)");
		return;
	}

	if (message.channel.id !== fromChannelId || message.author.bot) return;

    console.log(`[messageRelay] Message received: ${message.content} from ${message.author.tag}`);

	const targetChannel = await client.channels.fetch(toChannelId);
	if (!targetChannel?.isTextBased()) return;


	// TODO: Change how the button is sent in the first place, need to talk it out
	await message.reply({
		content: "**A CHANGER**: Voilà le bouton pour envoyer le formulaire de demande.",
		components: [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId("identificationButton")
					.setLabel("Demande d'identification")
					.setStyle(ButtonStyle.Primary)
			)
		]
	});

	// Delete the original message to prevent clutter
	message.delete();
}

// TODO: Broken, needs fixing and to be adapted for future needs
function makeContainer(message: Message): ContainerBuilder {
	return new ContainerBuilder()
		.setAccentColor(0xf01020)
		.addTextDisplayComponents(
			textDisplay => textDisplay
				.setContent(`${message.author.displayName} (@${message.author.tag})`)
		)
		.addSeparatorComponents(
			separator => separator,
		)
		.addTextDisplayComponents(
			textDisplay => textDisplay
				.setContent(message.content || "Message sans contenu."),
		)
		.addSectionComponents(
			section => section
				.addTextDisplayComponents(
					textDisplay => textDisplay
						.setContent('Cliquer sur un des boutons pour valider ou refuser la demande.')
				)
		).addActionRowComponents(
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId('acceptIdentification')
					.setLabel('Accepter la demande')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('rejectIdentification')
					.setLabel('Refuser la demande')
					.setStyle(ButtonStyle.Danger)
			)
		);
}

function makeEmbed(message: Message): { embeds: EmbedBuilder[], components: ActionRowBuilder<ButtonBuilder>[], content: string } {
	const embed: EmbedBuilder = new EmbedBuilder()
		.setColor(0xf01020)
		.setDescription(message.content || "`Message sans contenu.`")
		.setAuthor({
			name: `${message.author.displayName} (@${message.author.tag})`,
			iconURL: message.author.displayAvatarURL(),
		})
		.setFooter({ text: "Cliquer sur un des boutons ci-dessous pour valider ou refuser la demande." })
		.setTimestamp(message.createdAt);

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

	return { embeds: [embed], components: [buttons], content: `${message.author} a demandé une identification.`  }
}
