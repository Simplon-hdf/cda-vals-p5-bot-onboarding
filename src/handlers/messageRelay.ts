import { Message, Client, TextChannel, EmbedBuilder } from "discord.js";

export async function handleRelay(message: Message, client: Client) {
	const fromChannelId = process.env.RELAY_SOURCE_CHANNEL;
	const toChannelId = process.env.RELAY_TARGET_CHANNEL;

	if (!fromChannelId || !toChannelId) {
		console.error("RELAY_SOURCE or RELAY_DEST environment variables are not set.");
		return;
	}

	if (message.channel.id !== fromChannelId || message.author.bot) return;

	const targetChannel = await client.channels.fetch(toChannelId);
	if (!targetChannel?.isTextBased()) return;


	await (targetChannel as TextChannel).send({ embeds: [makeEmbed(message)], content: `${message.author} a demandé une identification.` });

	// Delete the original message to prevent clutter
	message.delete()
}

function makeEmbed(message: Message): EmbedBuilder {
	return new EmbedBuilder()
		.setColor(0xf01020)
		.setDescription(message.content || "`Message sans contenu.`")
		.setAuthor({
			name: `${message.author.displayName} (@${message.author.tag})`,
			iconURL: message.author.displayAvatarURL(),
		})
		.setFooter({ text: "Cliquer sur un des boutons ci-dessous pour valider ou refuser la demande." })
		.setTimestamp(message.createdAt);
}
