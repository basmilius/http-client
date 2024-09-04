import { DateTime } from 'luxon';
import type { Serialized } from './types';
import isDto from '../helper/isDto';
import serializeArray from './serializeArray';
import serializeDateTime from './serializeDateTime';
import serializeDto from './serializeDto';
import serializeObject from './serializeObject';

export default function (obj: unknown): Serialized | undefined {
    switch (true) {
        case obj === null:
            return null;

        case Array.isArray(obj):
            return serializeArray(obj);

        case isDto(obj):
            return serializeDto(obj);

        case DateTime.isDateTime(obj):
            return serializeDateTime(obj);

        case typeof obj === 'object':
            return serializeObject(obj);

        case typeof obj === 'boolean':
        case typeof obj === 'number':
        case typeof obj === 'string':
            return obj;

        default:
            return undefined;
    }
}
