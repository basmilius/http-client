import type DtoInstance from '../instance';
import isDto from './isDto';
import isDtoDirty from './isDtoDirty';
import markDtoClean from './markDtoClean';

/**
 * Executes the given function if the given dto is marked dirty.
 */
export default async function <T, R = void>(obj: T, fn: (dto: T & DtoInstance<T>) => Promise<R>): Promise<void> {
    if (!isDto(obj) || !isDtoDirty(obj)) {
        return;
    }

    await fn(obj);
    markDtoClean(obj);
}
