import { isDto } from './helper';
import { PROPERTIES } from './symbols';
import type DtoInstance from './instance';

/**
 * Returns the json object representation of the dto.
 */
export default function (this: DtoInstance<unknown>): Record<string, unknown> {
    return Object.fromEntries(
        this[PROPERTIES].map(property => {
            let value: unknown = Reflect.get.call(this, this, property, this);

            if (isDto(value)) {
                value = value.toJSON();
            }

            return [property, value];
        })
    );
}
