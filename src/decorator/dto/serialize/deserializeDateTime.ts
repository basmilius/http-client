import { DateTime } from 'luxon';
import type { SerializedDateTime } from './types';

export default function ([, iso]: SerializedDateTime): DateTime {
    return DateTime.fromISO(iso);
}
