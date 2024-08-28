import { DateTime } from 'luxon';

export function formatFileDateTime(dateTime?: DateTime): string {
    dateTime = dateTime || DateTime.now();

    return dateTime.toFormat('yyyy-MM-dd HH-mm-ss');
}
