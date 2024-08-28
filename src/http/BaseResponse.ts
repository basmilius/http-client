import type { HttpStatusCode } from '@/enum';

export class BaseResponse<T> {
    get data(): T {
        return this.#data;
    }

    get headers(): Headers {
        return this.#response.headers;
    }

    get ok(): boolean {
        return this.statusCode >= 200 && this.statusCode < 300;
    }

    get response(): Response {
        return this.#response;
    }

    get statusCode(): HttpStatusCode {
        return this.#response.status;
    }

    readonly #data: T;
    readonly #response: Response;

    constructor(data: T, response: Response) {
        this.#data = data;
        this.#response = response;
    }
}
