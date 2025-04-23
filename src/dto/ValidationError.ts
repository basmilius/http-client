import { dto } from '../decorator';

@dto
export default class ValidationError {
    get code(): number {
        return this.#code;
    }

    get error(): string {
        return this.#error;
    }

    get errorDescription(): string {
        return this.#errorDescription;
    }

    get errors(): Record<string, ValidationError> {
        return this.#errors;
    }

    get params(): Record<string, string | number | boolean> {
        return this.#params;
    }

    readonly #code: number;
    readonly #error: string;
    readonly #errorDescription: string;
    readonly #errors: Record<string, ValidationError>;
    readonly #params: Record<string, string | number | boolean>;

    constructor(code: number, error: string, errorDescription: string, errors?: Record<string, ValidationError>, params?: Record<string, string | number | boolean>) {
        this.#code = code;
        this.#error = error;
        this.#errorDescription = errorDescription;
        this.#errors = errors;
        this.#params = params;
    }
}
