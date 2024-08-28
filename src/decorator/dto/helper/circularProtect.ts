import type DtoInstance from '../instance';
import { ENABLE_CIRCULAR_LOGGING } from '@/decorator/dto/constant';

type CircularMap = WeakMap<DtoInstance<unknown>, (string | symbol)[]>;
const CIRCULAR_MAP = Symbol();

export default function <T extends (...args: any[]) => unknown>(fn: T, arg1: number = 0, arg2?: number): T {
    return function (...args: any[]): unknown  {
        const hasMap = CIRCULAR_MAP in fn;
        const map: CircularMap = fn[CIRCULAR_MAP] ??= new WeakMap();
        const primary = args[arg1];
        const secondary = arg2 !== undefined ? args[arg2] : 'self';

        if (typeof primary !== 'object') {
            return fn.call(this, ...args);
        }

        if (!map.has(primary)) {
            map.set(primary, []);
        }

        if (map.get(primary).includes(secondary)) {
            ENABLE_CIRCULAR_LOGGING && console.log(`%c@dto %ccircular protect %cdetected a circular reference`, 'color: #0891b2', 'color: #059669', 'color: #1d4ed8', {fn, primary, secondary});
            return;
        }

        map.get(primary).push(secondary);

        const result = fn.call(this, ...args);

        !hasMap && (delete fn[CIRCULAR_MAP]);

        return result;
    } as T;
}
