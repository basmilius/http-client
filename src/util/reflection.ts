export type Constructor<T = {}> = new (...args: any[]) => T;
export type Descriptors = Record<string | symbol, TypedPropertyDescriptor<unknown> | PropertyDescriptor>;

export function getPrototypeChain(obj: Function): Descriptors {
    const entries: Descriptors = {};

    do {
        if (obj.name === '') {
            break;
        }

        for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(obj.prototype))) {
            if (['constructor', 'clone', 'toJSON'].includes(key)) {
                continue;
            }

            if (!descriptor.get && !descriptor.set) {
                continue;
            }

            entries[key] = descriptor;
        }
    } while (obj = Object.getPrototypeOf(obj));

    return entries;
}

export function setObjectMethod(obj: Function, key: string, fn: Function): void {
    obj.prototype[key] = fn;
}

export function setObjectValue(obj: object, key: symbol | string, value: unknown): void {
    Object.defineProperty(obj, key, {value});
}
