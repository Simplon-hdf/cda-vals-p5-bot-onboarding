import { ConfigAPI } from "./ConfigAPI";
import { ConfigBot } from "./ConfigBot";

/**
 * ConfigManager is responsible for managing the bot configuration.
 * It provides methods to load, fetch, update, and overwrite configurations.
 */
export class ConfigManager {
    private static _config: ConfigBot | undefined;

    /**
     * Gets the current configuration.
     * @returns The current configuration.
     */
    public static get config(): ConfigBot | undefined {
        return ConfigManager._config;
    }

    /**
     * Loads the bot configuration, and keeps it saved in ConfigManager.
     * @param configId The ID of the configuration to load (optional).
     * @param verbose Whether to log verbose output (optional).
     * @returns The loaded configuration.
     */
    static async loadConfig(configId?: number, verbose?: boolean): Promise<ConfigBot> {
        this._config = await this.fetchConfig(configId, verbose);
        return this._config;
    }

    /**
     * Fetches the bot configuration.
     * @param configId The ID of the configuration to fetch (optional).
     * @param verbose Whether to log verbose output (optional).
     * @returns The fetched configuration.
     */
    static async fetchConfig(configId?: number, verbose?: boolean): Promise<ConfigBot> {
        if (verbose) { console.log(`[ConfigManager] Fetching config with ID ${configId}...`); }

        const configData = await ConfigAPI.fetchConfig(configId);

        if (verbose) { console.log(`[ConfigManager] Fetched config with ID ${configId}:`, configData); }

        if (!configData || !configData.configId) {
            throw new Error(`Configuration with ID ${configId} not found.`);
        }

        return new ConfigBot(configData);
    }

    // TODO: Implement this method API-wise
    /**
     * NOTE: This method is not implemented yet API-wise.
     * Overwrites the bot configuration in database using the provided configuration object.
     * @param config The configuration object to overwrite. If not provided, will use and load to the current configuration.
     * @param doLoad Whether to load the configuration after overwriting (default: false).
     * @param verbose Whether to log verbose output (optional).
     * @returns The overwritten configuration.
     */
    static async overwriteConfig(config?: ConfigBot, doLoad?: boolean, verbose?: boolean): Promise<ConfigBot> {
        if (config === undefined) {
            config = this._config;
            if (doLoad === undefined) {
                doLoad = true;
            }
        }

        if (!config || !config.configId) {
            throw new Error("Config object and configId are required for overwriting the config.");
        }

        if (verbose) { console.log(`[ConfigManager] Overwriting config with ID ${config.configId}:`, config); }
        const updatedData = await ConfigAPI.overwriteConfig(config);

        if (verbose) { console.log(`[ConfigManager] Overwritten config with ID ${config.configId}:`, updatedData); }
        const overwrittenConfig = new ConfigBot(updatedData);

        if (doLoad) { this._config = overwrittenConfig; }

        return overwrittenConfig;
    }


    /**
     * Updates the bot configuration.
     * @param configId The ID of the configuration to update.
     * @param body The updated configuration data.
     * @param verbose Whether to log verbose output (optional).
     * @returns The updated configuration.
     */
    static async updateConfig(configId: number, body: object, doLoad?: boolean, verbose?: boolean): Promise<ConfigBot> {
        if (!configId || !body) {
            throw new Error("Config ID and body are required for updating the config.");
        }

        if (verbose) { console.log(`[ConfigManager] Updating config with ID ${configId} with body:`, body); }

        const updatedData = await ConfigAPI.updateConfig(configId, body);

        if (verbose) { console.log(`[ConfigManager] Updated config with ID ${configId}:`, updatedData); }
        const overwrittenConfig = new ConfigBot(updatedData);

        if (doLoad) { this._config = overwrittenConfig; }

        return overwrittenConfig;
    }


    /**
     * Logs the current state of the ConfigBot instance.
     * This is useful for debugging and understanding the current configuration.
     * @param config The configuration object to print the state of.
     */
    static printState(config?: ConfigBot): void {
        if (config === undefined) {
            config = this._config;
        }

        if (!config) {
            throw new Error("No configuration given or loaded to print state.");
        }

        console.log("[ConfigManager] Current ConfigBot state:");

        for (const [key, value] of Object.entries(config)) {
            if (value === null || value === undefined) {
                console.warn(`[ConfigManager] > /!\\ Warning: ${key} is null or undefined.`);
            } else {
                console.log(`[ConfigManager] > ${key}: ${value}`);
            }
        }
    }
}