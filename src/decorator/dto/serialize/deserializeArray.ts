import deserializeUnknown from './deserializeUnknown';

export default function (obj: unknown[]): unknown[] {
    return obj.map(deserializeUnknown);
}
