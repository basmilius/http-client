import { DIRTY } from '../symbols';
import assertDto from './assertDto';

/**
 * Checks if the given dto is dirty.
 */
export default function (obj: unknown): boolean {
    assertDto(obj);
    return obj[DIRTY];
}
