import { markDtoDirty, trackDto, triggerDto } from './helper';
import { PARENT, PARENT_KEY, PROXY } from './symbols';
import type DtoInstance from './instance';

export default {
    /**
     * Trap for when a property is deleted from the target. This
     * will mark the parent dto as dirty and trigger an update.
     */
    deleteProperty(target: unknown[], key: string | symbol): boolean {
        Reflect.deleteProperty(target, key);

        if (ignored(target, key)) {
            return true;
        }

        const dto = target[PARENT] as DtoInstance<unknown>;
        dto && triggerDto(dto, target[PARENT_KEY], dto[target[PARENT_KEY]]);
        dto && markDtoDirty(dto, target[PARENT_KEY]);

        return true;
    },

    /**
     * Trap for when a property of the target is being accessed. The
     * property access is being tracked for further updates.
     */
    get(target: unknown[], key: string | symbol, receiver: any): unknown {
        if (key === PROXY) {
            return true;
        }

        if (ignored(target, key)) {
            return Reflect.get(target, key, receiver);
        }

        const dto = target[PARENT] as DtoInstance<unknown>;
        dto && trackDto(dto, target[PARENT_KEY]);

        return Reflect.get(target, key);
    },

    /**
     * Trap for when a property of the target is being updated. This
     * will mark the parent dto as dirty and trigger an update.
     */
    set(target: unknown[], key: string | symbol, value: unknown, receiver: any) {
        if (ignored(target, key)) {
            return Reflect.set(target, key, value, receiver);
        }

        const dto = target[PARENT] as DtoInstance<unknown>;
        dto && triggerDto(dto, target[PARENT_KEY], dto[target[PARENT_KEY]]);
        dto && markDtoDirty(dto, target[PARENT_KEY]);

        return Reflect.set(target, key, value);
    }
} satisfies ProxyHandler<unknown[]>;

/**
 * Checks if the given key should be ignored by the proxy.
 */
function ignored(target: unknown[], key: string | symbol): key is symbol {
    return typeof key === 'symbol' || typeof target[key] === 'function' || key === 'length';
}
