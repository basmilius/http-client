import type { Constructor } from '@/util';

const isStrict = true;

export default function <T extends Constructor>(Parent: T): T {
    return class extends Parent {
        constructor(...args: any[]) {
            if (isStrict) {
                throw new Error('Adapters cannot be instantiated.');
            }

            super(...args);
        }
    } as T;
}
