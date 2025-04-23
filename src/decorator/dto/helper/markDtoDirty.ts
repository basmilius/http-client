import { ENABLE_DIRTY_LOGGING } from '../constant';
import { DIRTY, NAME, PARENT, PARENT_KEY } from '../symbols';
import assertDto from './assertDto';
import circularProtect from './circularProtect';
import triggerDto from './triggerDto';

/**
 * Marks the given dto dirty.
 */
const markDtoDirty: (obj: unknown, key?: string | number) => void = circularProtect(function (obj: unknown, key?: string | number): void {
    assertDto(obj);

    if (!obj[DIRTY]) {
        obj[DIRTY] = true;
        ENABLE_DIRTY_LOGGING && console.log(`%c@dto %c${obj[NAME]} %cdirty`, 'color: #0891b2', 'color: #059669', 'color: #1d4ed8', 'marked dirty', {obj, key});
        triggerDto(obj, DIRTY, true, false);
    }

    if (!obj[PARENT]) {
        return;
    }

    markDtoDirty(obj[PARENT], obj[PARENT_KEY]);
});

export default markDtoDirty;
