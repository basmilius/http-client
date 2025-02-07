import { type Constructor, getPrototypeChain, setObjectMethod, setObjectValue } from '@basmilius/utils';
import { OVERRIDE_CONSOLE_LOG } from './constant';
import { instance, isDto } from './helper';
import { DTO_CLASS_MAP } from './map';
import { DESCRIPTORS, NAME, PROPERTIES } from './symbols';
import classProxy from './classProxy';
import clone from './clone';
import fill from './fill';
import type DtoInstance from './instance';
import toJSON from './toJSON';

/**
 * Provides reactivity to the decorated class.
 */
export default function <T extends Constructor>(clazz: T): T {
    validate(clazz);

    const descriptors = Object.freeze(getPrototypeChain(clazz));
    const properties = Object.keys(descriptors);

    setObjectValue(clazz.prototype, DESCRIPTORS, descriptors);
    setObjectValue(clazz.prototype, NAME, clazz.name);
    setObjectValue(clazz.prototype, PROPERTIES, properties);
    setObjectValue(clazz, Symbol.hasInstance, (instance: unknown) => typeof instance === 'object' && instance?.[NAME] === clazz.name);

    setObjectMethod(clazz, 'clone', clone<T>);
    setObjectMethod(clazz, 'fill', fill);
    setObjectMethod(clazz, 'toJSON', toJSON);

    return proxy(clazz);
}

export type {
    DtoInstance
};

function proxy<T extends Constructor>(clazz: T): T {
    const proxied = new Proxy(clazz, classProxy) as T;

    DTO_CLASS_MAP[clazz.name] = proxied as unknown as Constructor<DtoInstance<unknown>>;

    return proxied;
}

function validate(clazz: Function): void {
    const parent = Object.getPrototypeOf(clazz.prototype);

    if (NAME in parent) {
        throw new Error(`⛔️ @dto ${clazz.name} cannot extend parent class which is also decorated with @dto ${parent[NAME]}.`);
    }
}

if (OVERRIDE_CONSOLE_LOG) {
    const _error = console.error.bind(console);
    const _info = console.info.bind(console);
    const _log = console.log.bind(console);
    const _warn = console.warn.bind(console);

    const override = (fn: Function) => (...args: unknown[]) => {
        for (let i = args.length - 1; i >= 0; --i) {
            const arg = args[i];

            if (!isDto(arg)) {
                continue;
            }

            const dto = instance(arg);
            args.splice(i, 1, `📦 ${dto[NAME]}`, dto.toJSON());
        }

        return fn(...args);
    };

    console.error = override(_error);
    console.info = override(_info);
    console.log = override(_log);
    console.warn = override(_warn);
}
