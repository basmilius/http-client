import { dto } from '@/decorator';

@dto
export class BlobResponse {
    get blob(): Blob {
        return this.#blob;
    }

    get name(): string {
        return this.#name;
    }

    readonly #blob: Blob;
    readonly #name: string;

    constructor(blob: Blob, name: string) {
        this.#blob = blob;
        this.#name = name;
    }
}
