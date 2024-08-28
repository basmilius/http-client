import { dto } from '@/decorator';

@dto
export class Paginated<T> {
    get items(): T[] {
        return this.#items;
    }

    get page(): number {
        return this.#page;
    }

    get pageSize(): number {
        return this.#pageSize;
    }

    get pages(): number {
        return this.#pages;
    }

    get totalItems(): number {
        return this.#totalItems;
    }

    readonly #items: T[];
    readonly #page: number;
    readonly #pageSize: number;
    readonly #pages: number;
    readonly #totalItems: number;

    constructor(items: T[], page: number, pageSize: number, pages: number, totalItems: number) {
        this.#items = items;
        this.#page = page;
        this.#pageSize = pageSize;
        this.#pages = pages;
        this.#totalItems = totalItems;
    }
}
