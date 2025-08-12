import { ConfigBot } from "../config/ConfigBot";
import { BaseAPI } from "./BaseAPI";


/**
 * Class that provides methods to interact with the API, in the context of the bot's configuration.
 * @extends BaseAPI
 */
export class ConfigAPI extends BaseAPI {
    /**
     * Route for the bot configuration API.
     */
    readonly route: string = "config-bot";

    constructor(baseURL?: string) {
        super(baseURL)
    }

    /**
     * Default configuration ID to use when fetching the configuration.
     * This can be set via the environment variable `DEFAULT_CONFIG_ID`, or defaults to `null`.
     */
    readonly defaultId: number | null = process.env.DEFAULT_CONFIG_ID ? parseInt(process.env.DEFAULT_CONFIG_ID) : null;


    /**
     *
     * @param configId The ID of the configuration to fetch (optional).
     * If not provided, it will use the default configuration ID.
     * If no default ID is set, it will fetch the first configuration available.
     */
    async fetchConfig(configId?: number): Promise<any> {
        if (!configId) {
            if (this.defaultId === null) {
                return await this.fetchFirstConfig();
            }
            configId = this.defaultId;
        }

        return await this.get(`${this.route}/${configId}`);
    }


    // TODO: Discuss if this method is worth the risk.
    /**
     * Fetch the first configuration available in the database.
     * **Should be used sparingly.**
     *
     * Can cause a lot of confusion otherwise.
     * @returns The first configuration available in the database.
     */
    async fetchFirstConfig(): Promise<any> {
        return (await this.get(`${this.route}`))[0];
    }


    /**
     * Update the configuration with the given ID.
     *
     * Note that this doesn't require the full configuration object,
     * but only the fields that need to be updated.
     * @param configId The ID of the configuration to update.
     * @param body The updated configuration data.
     * @returns The updated configuration.
     */
    async updateConfig(configId: number, body: any): Promise<any> {
        return await this.patch(`${this.route}/${configId}`, body);
    }
    

    // TODO: Implement this route API-wise if needed
    /**
     * Overwrite the configuration with the given object.
     * @param config The configuration object to overwrite.
     * @returns 
     */
    async overwriteConfig(config: ConfigBot): Promise<any> {
        return await this.put(`${this.route}/${config.configId}`, config);
    }
}
