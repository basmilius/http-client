import deserializeUnknown from './deserializeUnknown';

export default function (serialized: string): unknown {
    return deserializeUnknown(JSON.parse(serialized));
}
