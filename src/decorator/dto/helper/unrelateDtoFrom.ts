import { CHILDREN, PARENT, PARENT_KEY } from '../symbols';
import type DtoInstance from '../instance';

/**
 * Removes a parent-child relationship between the given two dtos.
 */
export default function (dto: DtoInstance<unknown>, parent: DtoInstance<unknown>): void {
    if (CHILDREN in parent) {
        const index = parent[CHILDREN].indexOf(dto);
        parent[CHILDREN].splice(index, 1);
    }

    dto[PARENT] = undefined;
    dto[PARENT_KEY] = undefined;
}
