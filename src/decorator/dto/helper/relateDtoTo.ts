import { CHILDREN, PARENT, PARENT_KEY } from '../symbols';
import type DtoInstance from '../instance';

/**
 * Creates a parent-child relationship between the given two dtos.
 */
export default function (dto: DtoInstance<unknown>, parent: DtoInstance<unknown>, key: string): void {
    parent[CHILDREN] ??= [];
    !parent[CHILDREN].includes(dto) && parent[CHILDREN].push(dto);

    dto[PARENT] !== parent && (dto[PARENT] = parent);
    dto[PARENT_KEY] !== key && (dto[PARENT_KEY] = key);
}
