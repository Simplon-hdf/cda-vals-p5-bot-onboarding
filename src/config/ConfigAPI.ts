import { ConfigBot } from "./ConfigBot";

// TODO: Might want to make a utility API class for common API interactions
/**
 * Class that provides methods to interact with the API, in the context of the bot's configuration.
 */
export class ConfigAPI {
    /**
     * Base URL of the API.
     * This can be set via the environment variable `API_URL`,
     * or defaults to `http://127.0.0.1:3000`.
     */
    static readonly baseURL: string = process.env.API_URL || "http://127.0.0.1:3000";

    /**
     * Route for the bot configuration API.
     */
    static readonly route: string = "/config-bot";

    /**
     * Default configuration ID to use when fetching the configuration.
     * This can be set via the environment variable `DEFAULT_CONFIG_ID`, or defaults to `null`.
     */
    static readonly defaultId: number | null = process.env.DEFAULT_CONFIG_ID ? parseInt(process.env.DEFAULT_CONFIG_ID) : null;


    /**
     *
     * @param configId The ID of the configuration to fetch (optional).
     * If not provided, it will use the default configuration ID.
     * If no default ID is set, it will fetch the first configuration available.
     */
    static async fetchConfig(configId?: number): Promise<any> {
        if (!configId) {
            if (this.defaultId === null) {
                return await this.fetchFirstConfig();
            }
            configId = this.defaultId;
        }

        const response = await fetch(`${this.baseURL}${this.route}/${configId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch config with ID ${configId}: ${response.statusText}`);
        }
        return await response.json();
    }


    // TODO: Discuss if this method is worth the risk.
    /**
     * Fetch the first configuration available in the database.
     * **Should be used sparingly.**
     *
     * Can cause a lot of confusion otherwise.
     * @returns The first configuration available in the database.
     */
    static async fetchFirstConfig(): Promise<any> {
        const response = await fetch(`${this.baseURL}${this.route}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch first config: ${response.statusText}`);
        }
        return (await response.json())[0];
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
    static async updateConfig(configId: number, body: object): Promise<any> {
        const response = await fetch(`${this.baseURL}${this.route}/${configId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error(`Failed to update config with ID ${configId}: ${response.statusText}`);
        }
        return await response.json();
    }
    

    // TODO: Implement this route API-wise if needed
    /**
     * Overwrite the configuration with the given object.
     * @param config The configuration object to overwrite.
     * @returns 
     */
    static async overwriteConfig(config: ConfigBot): Promise<any> {
        const response = await fetch(`${this.baseURL}${this.route}/${config.configId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        });
        if (!response.ok) {
            throw new Error(`Failed to overwrite config with ID ${config.configId}: ${response.statusText}`);
        }
        return await response.json();
    }
}
