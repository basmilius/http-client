import type { Ref } from 'vue';
import { PROXY } from './symbols';
import type DtoInstance from './instance';

export default {
    /**
     * Trap for when a ref property is being accessed. The property
     * access is being tracked for further updates. If the requested
     * property is not a part of {Ref}, the get is proxied to the
     * underlying dto instance.
     *
     * A little trick with __v_isRef is done here, all the features
     * of refs are used by our dto, but we don't want Vue to treat
     * it as a ref. We return false here to trick Vue.
     */
    get(target: Ref<DtoInstance<unknown>>, key: string | symbol, receiver: any): unknown {
        if (key === '__v_isRef') {
            return false;
        }

        if (key === PROXY) {
            return true;
        }

        if (key in target) {
            return Reflect.get(target, key, receiver);
        }

        return Reflect.get(target.value, key);
    },

    /**
     * Trap for when a descriptor of a property is requested, that
     * request is proxied to the underlying dto.
     */
    getOwnPropertyDescriptor(target: Ref<DtoInstance<unknown>>, key: string | symbol): PropertyDescriptor | undefined {
        return Reflect.getOwnPropertyDescriptor(target.value, key);
    },

    /**
     * Trap for when the keys of the ref are requested, that request
     * is proxied to the underlying dto.
     */
    ownKeys(target: Ref<DtoInstance<unknown>>) {
        return Reflect.ownKeys(target.value);
    },

    /**
     * Trap for when a ref property is being updated. If the property
     * is not part of {Ref}, the set is proxied to the underlying dto
     * instance. In that proxy, the dto will be marked dirty and an
     * update is triggered.
     */
    set(target: Ref<DtoInstance<unknown>>, key: string | symbol, value: unknown, receiver: any): boolean {
        if (key in target) {
            return Reflect.set(target, key, value, receiver);
        }

        return Reflect.set(target.value, key, value);
    }
} satisfies ProxyHandler<Ref<DtoInstance<unknown>>>;
