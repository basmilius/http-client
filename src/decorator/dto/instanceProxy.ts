import { ENABLE_GET_LOGGING, ENABLE_SET_LOGGING } from './constant';
import { areEqual, markDtoDirty, relateValueTo, trackDto, triggerDto, unrelateValueFrom } from './helper';
import { DESCRIPTORS, NAME, PROPERTIES, PROXY } from './symbols';
import type DtoInstance from './instance';
import arrayProxy from './arrayProxy';

export default {
    /**
     * Trap for when a dto property is being accessed. The property
     * access is being tracked for further updates. If the dto has
     * any child dtos, a relationship will be added between them.
     */
    get(target: DtoInstance<unknown>, key: string | symbol, receiver: any): unknown {
        if (key === PROXY) {
            return true;
        }

        if (typeof key === 'symbol') {
            return Reflect.get(target, key, receiver);
        }

        const descriptor = target[DESCRIPTORS][key];

        if (!descriptor || !descriptor.get) {
            return Reflect.get(target, key, receiver);
        }

        const value = descriptor.get.call(target);

        ENABLE_GET_LOGGING && console.log(`%c@dto %c${target[NAME]} %cget`, 'color: #0891b2', 'color: #059669', 'color: #1d4ed8', key);
        trackDto(target, key);

        relateValueTo(target, key, value);

        return value;
    },

    /**
     * Trap for when a descriptor of a dto property is requested.
     */
    getOwnPropertyDescriptor(target: DtoInstance<unknown>, key: string | symbol): PropertyDescriptor | undefined {
        return target[DESCRIPTORS][key];
    },

    /**
     * Trap for when the keys of a dto are requested.
     */
    ownKeys(target: DtoInstance<unknown>) {
        return target[PROPERTIES];
    },

    /**
     * Trap for when a dto property is being updated. This will
     * mark the dto dirty and trigger an update. If an array is
     * passed, that array will be made reactive as well.
     */
    set(target: DtoInstance<unknown>, key: string | symbol, value: unknown, receiver: any): boolean {
        if (typeof key === 'symbol') {
            return Reflect.set(target, key, value, receiver);
        }

        const descriptor = target[DESCRIPTORS][key];

        if (!descriptor || !descriptor.set) {
            return Reflect.set(target, key, value, receiver);
        }

        const oldValue = descriptor.get?.call(target) ?? undefined;

        if (areEqual(value, oldValue)) {
            return true;
        }

        unrelateValueFrom(target, oldValue);

        if (Array.isArray(value) && !value[PROXY]) {
            value = new Proxy(value, arrayProxy);
        }

        ENABLE_SET_LOGGING && console.log(`%c@dto %c${target[NAME]} %cset`, 'color: #0891b2', 'color: #059669', 'color: #1d4ed8', key, {value});
        descriptor.set.call(target, value);

        relateValueTo(target, key, value);
        markDtoDirty(target, key);
        triggerDto(target, key, value, oldValue);

        return true;
    }
} satisfies ProxyHandler<DtoInstance<unknown>>;
