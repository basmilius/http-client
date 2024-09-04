import serializeUnknown from './serializeUnknown';

export default function (obj: object): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(obj)
            .map(([key, value]) => [key, serializeUnknown(value)])
            .filter(([, value]) => value !== undefined)
    );
}
