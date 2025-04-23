import { ENABLE_REACTIVE_LOGGING } from '../constant';
import { NAME, PARENT, PARENT_KEY, TRIGGER } from '../symbols';
import type DtoInstance from '../instance';
import circularProtect from './circularProtect';

/**
 * Trigger for when a dto property is being updated.
 */
const triggerDto: (dto: DtoInstance<unknown>, key: string | symbol, value: unknown, oldValue?: unknown) => void = circularProtect(function (dto: DtoInstance<unknown>, key: string | symbol, value: unknown, oldValue?: unknown): void {
    const trigger = dto[TRIGGER];
    trigger(dto, key, value, oldValue);

    ENABLE_REACTIVE_LOGGING && console.log(`%c@dto %c${dto[NAME]} %ctrigger`, 'color: #0891b2', 'color: #059669', 'color: #1d4ed8', key, {dto, value, oldValue});

    dto[PARENT] && triggerDto(dto[PARENT], dto[PARENT_KEY], dto[PARENT][dto[PARENT_KEY]]);
}, 0, 1);

export default triggerDto;
