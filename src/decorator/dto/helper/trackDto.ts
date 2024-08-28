import { ENABLE_REACTIVE_LOGGING } from '../constant';
import { NAME, TRACK } from '../symbols';
import type DtoInstance from '../instance';

/**
 * Tracking for when a dto property is being accessed.
 */
export default function trackDto(dto: DtoInstance<unknown>, key: string): void {
    const track = dto[TRACK];
    track(dto, key);

    ENABLE_REACTIVE_LOGGING && console.log(`%c@dto %c${dto[NAME]} %ctrack`, 'color: #0891b2', 'color: #059669', 'color: #1d4ed8', key, {dto});
}
