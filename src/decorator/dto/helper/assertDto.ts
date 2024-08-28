import type DtoInstance from '../instance';
import isDto from './isDto';

/**
 * Asserts that the given object is a dto.
 */
export default function (obj: unknown): asserts obj is DtoInstance<never> {
    if (!isDto(obj)) {
        throw new Error('@dto assert given object is not a class decorated with @Dto.');
    }
}
