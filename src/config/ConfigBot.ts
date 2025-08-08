export class ConfigBot {
    readonly configId: number;

    readonly salonArriveeId: string | null;
    readonly nouvelArrivantRoleId: string | null;
    readonly salonIdentificationId: string | null;
    readonly salonIdentificationStaffId: string | null;
    readonly apprenantRoleId: string | null;
    readonly alumniRoleId: string | null;
    readonly formateurRoleId: string | null;
    readonly staffRoleId: string | null;
    readonly templateCategorieId: string | null;
    readonly templateApprenantRoleId: string | null;
    readonly templateAlumniRoleId: string | null;
    readonly templateFormateurRoleId: string | null;

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
