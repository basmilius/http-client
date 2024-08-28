import type { Descriptors } from '@/util';
import { ARGS, CHILDREN, DESCRIPTORS, DIRTY, NAME, PARENT, PARENT_KEY, PROPERTIES, TRACK, TRIGGER } from './symbols';

export default interface DtoInstance<T> extends Function {
    [ARGS]: any[];
    [CHILDREN]?: DtoInstance<unknown>[];
    [DESCRIPTORS]: Descriptors;
    [DIRTY]: boolean;
    [NAME]: string;
    [PARENT]?: DtoInstance<unknown>;
    [PARENT_KEY]?: string;
    [PROPERTIES]: string[];
    [TRACK]: (instance: DtoInstance<unknown>, key: string) => void;
    [TRIGGER]: (instance: DtoInstance<unknown>, key: string | symbol, value: unknown, oldValue?: unknown) => void;

    /**
     * Clones the DTO starting with the original arguments
     * and replaces them with the current values. Unfortunately
     * this is the only way at this point. It's a good thing
     * we don't need cloning a lot :)
     */
    clone(): DtoInstance<T>;

    /**
     * Fills the DTO with the given data.
     */
    fill(data: Record<string, unknown>): void;

    /**
     * Gets all getters of the DTO and returns them as
     * an object, so {@see JSON.stringify} knows what
     * to do with our DTO.
     */
    toJSON(): Record<string, unknown>;
}
