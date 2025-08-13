/**
 * Main class that handles basic requests.
 * Should be extended for each part.
 */
export abstract class BaseAPI {
    /**
     * Base URL of the API.
     * This can be set via the environment variable `API_URL`,
     * or defaults to `http://127.0.0.1:3000`.
     */
    protected readonly baseURL: string;
    
    protected headers: Record<string, string>;

    
    constructor(baseURL?: string) {
        this.baseURL = baseURL || process.env.API_URL || "http://127.0.0.1:3000";
        this.headers = {
            "Content-Type": "application/json",
            // TODO: Once the API requires a token, add the requirement here, from environment.
        }
    }
    

    /**
     * GET Request.
     * @param route Route to the resource, excluding the base url.
     * @returns 
     */
    protected async get(route: string) {
        const response = await fetch(`${this.baseURL}/${route}`, {
            method: "GET",
            headers: this.headers,
        });

        if (!response.ok) {
            throw new Error(`GET ${route}: ${response.statusText}`);
        }

        return await response.json();
    }


    /**
     * PUT Request.
     * @param route Route to the resource, excluding the base url.
     * @returns 
     */
    protected async put(route: string, body: any): Promise<any> {
        const response = await fetch(`${this.baseURL}/${route}`, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`PUT ${route}: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * PATCH Request.
     * @param route Route to the resource, excluding the base url.
     * @returns 
     */
    protected async patch(route: string, body: any): Promise<any> {
        const response = await fetch(`${this.baseURL}/${route}`, {
            method: "PATCH",
            headers: this.headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`PATCH ${route}: ${response.statusText}`);
        }

        return await response.json();
    }


    /**
     * POST Request.
     * @param route Route to the resource, excluding the base url.
     * @returns 
     */
    protected async post(route: string, body: any): Promise<any> {
        const response = await fetch(`${this.baseURL}/${route}`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`POST ${route}: ${response.statusText}`);
        }

        return await response.json();
    }


    /**
     * DELETE Request.
     * @param route Route to the resource, excluding the base url.
     * @returns 
     */
    protected async delete(route: string, body: any): Promise<any> {
        const response = await fetch(`${this.baseURL}/${route}`, {
            method: "DELETE",
            headers: this.headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`DELETE ${route}: ${response.statusText}`);
        }

        return await response.json();
    }
}