import { ChannelType, SlashCommandBuilder } from "discord.js";
import { ConfigManager } from "../../config/ConfigManager";

export const data = new SlashCommandBuilder()
    .setName("config")
    .setDescription("(Admin) Met à jour la configuration du bot.")
    .setDefaultMemberPermissions(0)
    .addIntegerOption(option =>
        option.setName("config_id")
            .setDescription("Identifiant unique de la configuration à mettre à jour.")
            .setRequired(true)
    )
    .addChannelOption(option =>
        option.setName("salon_arrivee_id")
            .setDescription("Salon où les nouveaux arrivants sont envoyés pour donner leur nom.")
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName("nouvel_arrivant_role_id")
            .setDescription("Rôle attribué aux nouveaux arrivants après avoir donné leur nom.")
            .setRequired(false)
    )
    .addChannelOption(option =>
        option.setName("salon_identification_id")
            .setDescription("Salon où les utilisateurs peuvent demander à rejoindre une promotion.")
            .setRequired(false)
    )
    .addChannelOption(option =>
        option.setName("salon_identification_staff_id")
            .setDescription("Salon où le staff peut identifier les utilisateurs.")
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName("apprenant_role_id")
            .setDescription("Rôle attribué aux utilisateurs identifiés comme apprenants.")
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName("alumni_role_id")
            .setDescription("Rôle attribué aux utilisateurs identifiés comme alumni.")
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName("formateur_role_id")
            .setDescription("Rôle attribué aux utilisateurs identifiés comme coachs.")
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName("staff_role_id")
            .setDescription("Rôle attribué aux membres du staff.")
            .setRequired(false)
    )
    .addChannelOption(option =>
        option.setName('template_category_id')
            .setDescription('La catégorie à utiliser pour copier les channels')
            .addChannelTypes(ChannelType.GuildCategory) // Show the categories in the dropdown
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName("template_apprenant_role_id")
            .setDescription("Rôle modèle pour les permissions des apprenants dans les nouvelles promotions.")
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName("template_alumni_role_id")
            .setDescription("Rôle modèle pour les permissions des alumni dans les nouvelles promotions.")
            .setRequired(false)
    )
    .addRoleOption(option =>
        option.setName("template_formateur_role_id")
            .setDescription("Rôle modèle pour les permissions des coachs dans les nouvelles promotions.")
            .setRequired(false)
    );

import { ChatInputCommandInteraction } from "discord.js";

export async function execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isCommand()) return;

    // Double check, only allow admins
    if (!interaction.memberPermissions?.has("Administrator")) {
        await interaction.reply({ content: "Vous n'avez pas la permission d'éxecuter cette commande.", ephemeral: true });
        return;
    }

    const configId = interaction.options.getInteger("config_id");

    // Collect all possible fields
    const channelFields: string[] = [
        "salon_arrivee_id",
        "salon_identification_id",
        "salon_identification_staff_id",
    ];
    const roleFields: string[] = [
        "nouvel_arrivant_role_id",
        "apprenant_role_id",
        "alumni_role_id",
        "formateur_role_id",
        "staff_role_id",
        "template_apprenant_role_id",
        "template_alumni_role_id",
        "template_formateur_role_id",
    ];

    const body: any = {};

    for (const field of channelFields) {
        const channel = interaction.options.getChannel(field);
        if (channel) {
            body[field] = channel.id;
        }
    }

    for (const field of roleFields) {
        const role = interaction.options.getRole(field);
        if (role) {
            body[field] = role.id;
        }
    }

    // Template Category
    const category = interaction.options.getChannel('template_category_id');

    if (category) {
        if (category.type === ChannelType.GuildCategory) {
            body.template_category_id = category.id;
        } else {
            await interaction.reply({ content: "La catégorie entrée doit être une catégorie.", ephemeral: true });
            return;
        }
    }


    // Actually update using ConfigManager
    if (Object.keys(body).length === 0) {
        await interaction.reply({ content: "Aucun champ à mettre à jour n'a été fourni.", ephemeral: true });
        return;
    }

    try {
        await ConfigManager.updateConfig(
            configId!,
            {
                salonArriveeId: body.salon_arrivee_id,
                nouvelArrivantRoleId: body.nouvel_arrivant_role_id,
                salonIdentificationId: body.salon_identification_id,
                salonIdentificationStaffId: body.salon_identification_staff_id,
                apprenantRoleId: body.apprenant_role_id,
                alumniRoleId: body.alumni_role_id,
                formateurRoleId: body.formateur_role_id,
                staffRoleId: body.staff_role_id,
                templateCategoryId: body.template_category_id,
                templateApprenantRoleId: body.template_apprenant_role_id,
                templateAlumniRoleId: body.template_alumni_role_id,
                templateFormateurRoleId: body.template_formateur_role_id,
            },
            true, // Reloads the configuration after updating
        );
        await interaction.reply({ content: `Configuration mise à jour : ${Object.entries(body).map(([k, v]) => `${k} = ${v}`).join(', ')}`, ephemeral: true });
    } catch (err: any) {
        await interaction.reply({ content: `Erreur lors de la mise à jour : ${err.message}`, ephemeral: true });
    }
}
