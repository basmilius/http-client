import { dto } from '@/decorator';
import type { HttpStatusCode } from '@/enum';

@dto
export class RequestError {
    get code(): number {
        return this.#code;
    }

    get error(): string {
        return this.#error;
    }

    get errorDescription(): string {
        return this.#errorDescription;
    }

    get statusCode(): HttpStatusCode {
        return this.#statusCode;
    }

    readonly #code: number;
    readonly #error: string;
    readonly #errorDescription: string;
    readonly #statusCode: HttpStatusCode;

    constructor(code: number, error: string, errorDescription: string, statusCode: HttpStatusCode) {
        this.#code = code;
        this.#error = error;
        this.#errorDescription = errorDescription;
        this.#statusCode = statusCode;
    }
}
