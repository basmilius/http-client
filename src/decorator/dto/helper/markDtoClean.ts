import { ENABLE_DIRTY_LOGGING } from '../constant';
import { CHILDREN, DIRTY, NAME } from '../symbols';
import assertDto from './assertDto';
import circularProtect from './circularProtect';
import isDtoDirty from './isDtoDirty';
import triggerDto from './triggerDto';

/**
 * Marks the given dto clean.
 */
const markDtoClean: (obj: unknown) => void = circularProtect(function (obj: unknown): void {
    assertDto(obj);

    if (obj[DIRTY]) {
        obj[DIRTY] = false;
        ENABLE_DIRTY_LOGGING && console.log(`%c@dto %c${obj[NAME]} %cdirty`, 'color: #0891b2', 'color: #059669', 'color: #1d4ed8', 'marked clean', {obj});
        triggerDto(obj, DIRTY, false, true);
    }

    if (!obj[CHILDREN] || obj[CHILDREN].length === 0) {
        return;
    }

    obj[CHILDREN]
        .filter(isDtoDirty)
        .forEach(markDtoClean);
});

export default markDtoClean;
