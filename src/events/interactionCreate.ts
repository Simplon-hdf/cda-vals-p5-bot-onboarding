import { Client, Events, Interaction } from "discord.js";
import { identificationValidation } from "../handlers/identificationValidation";

export const type = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction, client: Client) {
    console.log(`Interaction received: ${interaction.type} from ${interaction.user.tag}`);

    console.log(`Handling interaction relay for channel: ${interaction.channelId}`);
    await identificationValidation(interaction, client);
}
