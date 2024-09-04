import deserializeUnknown from './deserializeUnknown';

export default function (obj: object): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(obj)
            .map(([key, value]) => [key, deserializeUnknown(value)])
            .filter(([, value]) => value !== undefined)
    );
}
