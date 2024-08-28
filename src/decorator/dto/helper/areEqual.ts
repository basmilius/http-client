import isDto from './isDto';

/**
 * Checks if the two given values are equal. When both values are a
 * dto, the check is done by firstly converthing them to JSON.
 */
export default function (a: unknown, b:  unknown): boolean {
    if (!isDto(a) || !isDto(b)) {
        return a === b;
    }

    return JSON.stringify(a) === JSON.stringify(b);
}
