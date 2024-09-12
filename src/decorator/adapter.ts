import type { Constructor } from '@/util';

const IS_STRICT = true;

export default function <T extends Constructor>(Parent: T): T {
    return class extends Parent {
        constructor(...args: any[]) {
            if (IS_STRICT) {
                throw new Error('@adapter: cannot create instance of class.');
            }

            super(...args);
        }
    } as T;
}
