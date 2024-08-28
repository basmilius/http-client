import { isDto } from './helper';
import { DESCRIPTORS } from './symbols';
import type DtoInstance from './instance';

/**
 * Fills the dto with the given data.
 */
export default function (this: DtoInstance<unknown>, data: Record<string, unknown>): void {
    for (let key in data) {
        const descriptor = this[DESCRIPTORS][key];

        if (isDto(this[key]) && typeof data[key] === 'object') {
            this[key].fill(data[key] as Record<string, unknown>);
        } else if (descriptor && descriptor.set) {
            this[key] = data[key];
        }
    }
}
