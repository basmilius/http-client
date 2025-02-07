import type { Constructor } from '@basmilius/utils';

export default function <T extends Constructor>(Parent: T): T {
    return class extends Parent {
        // @ts-ignore
        constructor(...args: any[]) {
            throw new Error('@adapter: cannot create instance of class.');
        }
    } as T;
}
