export default class QueryString {
    readonly #builder: URLSearchParams;

    constructor() {
        this.#builder = new URLSearchParams();
    }

    public build(): string {
        return this.#builder.toString();
    }

    public append(name: string, value: QueryStringValue): QueryString {
        return this.#add(this.#builder.append.bind(this.#builder), name, value);
    }

    public appendArray(name: string, values: QueryStringValue[] | null): QueryString {
        if (values === undefined || values === null) {
            return this;
        }

        values.forEach(value => this.append(name, value));

        return this;
    }

    public delete(name: string): QueryString {
        this.#builder.delete(name);

        return this;
    }

    public get(name: string): string | null {
        return this.#builder.get(name);
    }

    public getAll(name: string): string[] {
        return this.#builder.getAll(name);
    }

    public has(name: string): boolean {
        return this.#builder.has(name);
    }

    public set(name: string, value: QueryStringValue): QueryString {
        return this.#add(this.#builder.set.bind(this.#builder), name, value);
    }

    #add(fn: ((name: string, value: string) => void), name: string, value: QueryStringValue): QueryString {
        if (!value && value !== false) {
            return this;
        }

        switch (typeof value) {
            case 'boolean':
                fn(name, value ? 'true' : 'false');
                break;

            case 'number':
                fn(name, value.toString(10));
                break;

            case 'string':
                fn(name, value);
                break;
        }

        return this;
    }

    public static builder(): QueryString {
        return new QueryString();
    }
}

type QueryStringValue = boolean | number | string | null;
