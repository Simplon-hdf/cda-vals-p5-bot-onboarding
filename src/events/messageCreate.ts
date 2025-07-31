import { Client, Events, Message } from "discord.js";
import { handleRelay } from "../handlers/messageRelay";

export const type = Events.MessageCreate;
export const once = false;

export async function execute(message: Message, client: Client) {
    if (message.author.bot) return;
    console.log(`Message received: ${message.content} from ${message.author.tag}`);

    console.log(`Handling message relay for channel: ${message.channel.id}`);
    await handleRelay(message, client);
}
