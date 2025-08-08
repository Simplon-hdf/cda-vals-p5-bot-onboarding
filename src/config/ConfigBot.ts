/**
 * Class representing the configuration for the bot.
 */
export class ConfigBot {
    /**
     * Unique identifier for the configuration. **Cannot be `null`**.
     * This is used to identify the configuration in the database.
     * @type {number}
     * @readonly
     * @public
     */
    readonly configId: number;

    /**
     * Snowflake of the channel where new arrivals are sent to give their name.
     * @readonly
     * @public
     */
    readonly salonArriveeId: string | null;

    /**
     * Snowflake of the role assigned to new arrivals,
     * once they gave their name.
     * @readonly
     * @public
     */
    readonly nouvelArrivantRoleId: string | null;

    /**
     * Snowflake of the channel where users can ask to join a promotion.
     * @readonly
     * @public
     */
    readonly salonIdentificationId: string | null;

    /**
     * Snowflake of the channel where staff members can identify users.
     * @readonly
     * @public
     */
    readonly salonIdentificationStaffId: string | null;

    /**
     * Snowflake of the role assigned to users who are identified as learners.
     * @readonly
     * @public
     */
    readonly apprenantRoleId: string | null;

    /**
     * Snowflake of the role assigned to users who are identified as alumni.
     * @readonly
     * @public
     */
    readonly alumniRoleId: string | null;

    /**
     * Snowflake of the role assigned to users who are identified as coaches.
     * @readonly
     * @public
     */
    readonly formateurRoleId: string | null;

    /**
     * Snowflake of the role assigned to staff members.
     * @readonly
     * @public
     */
    readonly staffRoleId: string | null;

    /**
     * Snowflake of the category that's copied to create new promotions.
     * @readonly
     * @public
     */
    readonly templateCategorieId: string | null;

    /**
     * Snowflake of the placeholder role used to assign permissions
     * to the learners in new promotions.
     * @readonly
     * @public
     */
    readonly templateApprenantRoleId: string | null;

    /**
     * Snowflake of the placeholder role used to assign permissions
     * to the alumni in new promotions.
     * @readonly
     * @public
     */
    readonly templateAlumniRoleId: string | null;

    /**
     * Snowflake of the placeholder role used to assign permissions
     * to the coaches in new promotions.
     * @readonly
     * @public
     */
    readonly templateFormateurRoleId: string | null;

    /**
     * Creates a new ConfigBot instance.
     * @param config The configuration object to initialize the instance with.
     */
    constructor(config: {
            configId: number,
            salonArriveeId: string | null,
            nouvelArrivantRoleId: string | null,
            salonIdentificationId: string | null,
            salonIdentificationStaffId: string | null,
            apprenantRoleId: string | null,
            alumniRoleId: string | null,
            formateurRoleId: string | null,
            staffRoleId: string | null,
            templateCategorieId: string | null,
            templateApprenantRoleId: string | null,
            templateAlumniRoleId: string | null,
            templateFormateurRoleId: string | null
        }) {
            
        this.configId = config.configId;
        this.salonArriveeId = config.salonArriveeId;
        this.nouvelArrivantRoleId = config.nouvelArrivantRoleId;
        this.salonIdentificationId = config.salonIdentificationId;
        this.salonIdentificationStaffId = config.salonIdentificationStaffId;
        this.apprenantRoleId = config.apprenantRoleId;
        this.alumniRoleId = config.alumniRoleId;
        this.formateurRoleId = config.formateurRoleId;
        this.staffRoleId = config.staffRoleId;
        this.templateCategorieId = config.templateCategorieId;
        this.templateApprenantRoleId = config.templateApprenantRoleId;
        this.templateAlumniRoleId = config.templateAlumniRoleId;
        this.templateFormateurRoleId = config.templateFormateurRoleId;
    }
}
