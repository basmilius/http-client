import { ENABLE_SERIALIZATION_LOGGING } from '../constant';
import { DTO_CLASS_MAP } from '../map';
import type { SerializedDto } from './types';
import type DtoInstance from '../instance';
import deserializeArray from './deserializeArray';
import deserializeObject from './deserializeObject';

const CACHE: Record<string, unknown> = {};

export default function ([, id, name, state, args]: SerializedDto): DtoInstance<unknown> {
    if (!(name in DTO_CLASS_MAP)) {
        throw new Error(`Cannot restore @dto. Dto ${name} was not found.`);
    }

    if (id in CACHE) {
        return CACHE[id] as DtoInstance<unknown>;
    }

    ENABLE_SERIALIZATION_LOGGING && console.group('⭐️', name, id);
    const Dto = DTO_CLASS_MAP[name];
    const instance = new Dto(...deserializeArray(args));
    instance.fill(deserializeObject(state));
    ENABLE_SERIALIZATION_LOGGING && console.groupEnd();

    CACHE[id] = instance;

    return instance;
}
