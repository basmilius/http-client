import { DateTime } from 'luxon';
import type { Serialized } from './types';
import isDto from '../helper/isDto';
import serializeDateTime from './serializeDateTime';
import serializeDto from './serializeDto';
import serializeUnknown from './serializeUnknown';

export default function (obj: unknown[]): Serialized[] {
    switch (true) {
        case obj.every(isDto):
            return obj.map(serializeDto);

        case obj.every(DateTime.isDateTime):
            return obj.map(serializeDateTime);

        default:
            return obj.map(serializeUnknown);
    }
}
