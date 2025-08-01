import { Message, Client, TextChannel, EmbedBuilder, ContainerBuilder, ButtonStyle, MessageFlags, ActionRowBuilder, ButtonBuilder } from "discord.js";

export async function handleRelay(message: Message, client: Client) {
	const fromChannelId = process.env.RELAY_SOURCE_CHANNEL;
	const toChannelId = process.env.RELAY_TARGET_CHANNEL;

	if (!fromChannelId || !toChannelId) {
		console.error("RELAY_SOURCE or RELAY_DEST environment variables are not set.");
		return;
	}

	if (message.channel.id !== fromChannelId || message.author.bot) return;

    console.log(`messageRelay> Message received: ${message.content} from ${message.author.tag}`);

	const targetChannel = await client.channels.fetch(toChannelId);
	if (!targetChannel?.isTextBased()) return;


	//await (targetChannel as TextChannel).send({ flags: MessageFlags.IsComponentsV2, components: [makeContainer(message)] });
	await (targetChannel as TextChannel).send(makeEmbed(message));

	// Delete the original message to prevent clutter
	message.delete()
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
