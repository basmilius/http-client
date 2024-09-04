import type { SerializedDto } from './types';

export default function (obj: unknown): obj is SerializedDto {
    return Array.isArray(obj) && obj[0] === 0xBF1;
}
