import type { IResponseErrors } from '@/http';
import { dto } from '@/decorator';
import { HttpStatusCode } from '@/enum';

@dto
export class RequestError {
    get errors(): IResponseErrors {
        return this.#errors;
    }

    get message(): string {
        return this.#message;
    }

    get statusCode(): HttpStatusCode {
        return this.#statusCode;
    }

    readonly #errors: IResponseErrors;
    readonly #message: string;
    readonly #statusCode: HttpStatusCode;

    constructor(message: string, errors: IResponseErrors, statusCode: HttpStatusCode) {
        this.#errors = errors;
        this.#message = message;
        this.#statusCode = statusCode;
    }
}
