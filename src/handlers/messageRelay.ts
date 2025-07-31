import { Message, Client, TextChannel } from "discord.js";

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

	
	await (targetChannel as TextChannel).send(`**${message.author.tag}**: ${message.content}`);
	message.delete();
}
