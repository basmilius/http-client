import type { BaseResponse, RequestBuilder } from '@/http';

export class HttpClient {
    get authToken(): string | null {
        return this.#authToken;
    }

    set authToken(value: string | null) {
        this.#authToken = value;
    }

    get baseUrl(): string {
        return this.#baseUrl;
    }

    get timezone(): string | null {
        return this.#timezone;
    }

    set timezone(value: string | null) {
        this.#timezone = value;
    }

    #authToken: string | null;
    #timezone: string | null;
    readonly #baseUrl: string;

    constructor(authToken: string | null, baseUrl: string) {
        this.#authToken = authToken;
        this.#baseUrl = baseUrl;
        this.#timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    onException(err: unknown, caller: unknown): void {
    }

    onRequest(request: RequestBuilder): RequestBuilder {
        return request;
    }

    onResponse(response: BaseResponse<unknown>): void {
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
