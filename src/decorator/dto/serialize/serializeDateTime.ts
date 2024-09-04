import type { DateTime } from 'luxon';
import type { SerializedDateTime } from './types';

export default function (obj: DateTime): SerializedDateTime {
    return [0xBF2, obj.toISO({
        extendedZone: true,
        includeOffset: true
    })];
}
