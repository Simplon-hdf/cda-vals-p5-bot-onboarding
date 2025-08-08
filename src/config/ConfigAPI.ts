import { ConfigBot } from "./ConfigBot";

export class ConfigAPI {
    static readonly baseURL: string = process.env.API_URL || "http://127.0.0.1:3000";
    static readonly route: string = "/config-bot";
    static readonly defaultId: number | null = process.env.DEFAULT_CONFIG_ID ? parseInt(process.env.DEFAULT_CONFIG_ID) : null;

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


    static async fetchFirstConfig(): Promise<any> {
        const response = await fetch(`${this.baseURL}${this.route}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch first config: ${response.statusText}`);
        }
        return (await response.json())[0];
    }


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
