import { customRef, markRaw } from 'vue';
import type { Constructor } from '@/util';
import { ARGS, DIRTY, TRACK, TRIGGER } from './symbols';
import DtoInstance from './instance';
import arrayProxy from './arrayProxy';
import instanceProxy from './instanceProxy';
import refProxy from './refProxy';

export default {
    /**
     * Trap for when a dto is being constructed. Reactivity is provided
     * to all arguments and a proxied custom ref is returned that references
     * the actual dto instance.
     */
    construct(target: Constructor, argsArray: any[], newTarget: Function): DtoInstance<unknown> {
        // note(Bas): This will apply reactivity to any array arguments.
        argsArray = argsArray.map(arg => {
            if (!Array.isArray(arg)) {
                return arg;
            }

            return new Proxy(arg, arrayProxy);
        });

        const ref = customRef((track, trigger) => {
            const instance = markRaw(Reflect.construct(target, argsArray, newTarget));
            instance[ARGS] = argsArray;
            instance[DIRTY] = false;
            instance[TRACK] = track;
            instance[TRIGGER] = trigger;

            const proxied = new Proxy(instance, instanceProxy);

            return {
                // note(Bas): track that the dto itself is being accessed.
                get: () => {
                    track();
                    return proxied;
                },

                // note(Bas): setter is never used, but we don't want to
                //  cause any errors.
                set: () => void 0
            };
        });

        return new Proxy(ref, refProxy) as unknown as DtoInstance<unknown>;
    }
} satisfies ProxyHandler<Constructor>;
