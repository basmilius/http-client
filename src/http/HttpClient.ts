export default class HttpClient {
    get authToken(): string | null {
        return this.#authToken;
    }

    set authToken(value: string | null) {
        this.#authToken = value;
    }

    get baseUrl(): string {
        return this.#baseUrl;
    }

    get dataField(): boolean {
        return this.#dataField;
    }

    #authToken: string | null;
    readonly #baseUrl: string;
    readonly #dataField: boolean;

    constructor(authToken: string | null, baseUrl: string, dataField: boolean = false) {
        this.#authToken = authToken;
        this.#baseUrl = baseUrl;
        this.#dataField = dataField;
    }

    static get instance(): HttpClient {
        if (HttpClient.#instance === null) {
            throw new Error('There is currently no HttpClient instance registered. Register one using the HttpClient.register() function.');
        }

        return HttpClient.#instance;
    }

    static #instance: HttpClient | null = null;

    static register(client: HttpClient): void {
        HttpClient.#instance = client;
    }
}
