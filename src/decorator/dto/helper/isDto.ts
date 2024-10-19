import { NAME } from '../symbols';
import type DtoInstance from '../instance';

/**
 * Checks if the given object is a dto.
 */
export default function (obj: unknown): obj is DtoInstance<unknown> {
    return obj && typeof obj === 'object' && !!obj[NAME];
}
