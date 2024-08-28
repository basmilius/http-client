import { PARENT, PARENT_KEY } from '../symbols';
import type DtoInstance from '../instance';
import isDto from './isDto';
import relateDtoTo from './relateDtoTo';

/**
 * Creates relationships between the given value and dto.
 */
export default function (dto: DtoInstance<unknown>, key: string, value: unknown): void {
    if (isDto(value)) {
        relateDtoTo(value, dto, key);
    } else if (Array.isArray(value)) {
        if (value.some(isDto)) {
            value
                .filter(isDto)
                .forEach(val => relateDtoTo(val, dto, key));
        }

        value[PARENT] = dto;
        value[PARENT_KEY] = key;
    }
}
