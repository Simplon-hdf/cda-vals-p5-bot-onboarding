import { Client, Events, Interaction } from "discord.js";
import { identificationValidation } from "../handlers/identificationValidation";
import { nameInput } from "../handlers/nameInput";
import { identificationRequest } from "../handlers/identificationRequest";

export const type = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction, client: Client) {
    console.log(`Interaction received: ${interaction} from ${interaction.user.tag}`);

    if ("customId" in interaction) {
        console.log(`> Interaction has a customId: ${interaction.customId}`);
    }

    console.log(`> Handling interaction relay for channel: ${interaction.channelId}`);
    await identificationValidation(interaction, client);

    await nameInput(interaction, client);
    await identificationRequest(interaction, client);
}
