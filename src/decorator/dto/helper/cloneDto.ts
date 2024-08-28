import assertDto from './assertDto';

/**
 * Clones the given dto.
 */
export default function <T>(obj: T): T {
    assertDto(obj);
    return obj.clone() as T;
}
