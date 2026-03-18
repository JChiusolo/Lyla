// api-client/src/client.js

class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async get(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    }

    async post(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    }

    async put(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    }

    async delete(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
    }
}

// Exporting the ApiClient class
export default ApiClient;