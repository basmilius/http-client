import serializeUnknown from './serializeUnknown';

export default function (obj: unknown): string {
    return JSON.stringify(serializeUnknown(obj));
}
