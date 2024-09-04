import deserializeArray from './deserializeArray';
import deserializeDateTime from './deserializeDateTime';
import deserializeDto from './deserializeDto';
import deserializeObject from './deserializeObject';
import isSerializedDateTime from './isSerializedDateTime';
import isSerializedDto from './isSerializedDto';

export default function (obj: unknown): unknown {
    switch (true) {
        case obj === null:
            return null;

        case Array.isArray(obj):
            switch (true) {
                case isSerializedDateTime(obj):
                    return deserializeDateTime(obj);

                case isSerializedDto(obj):
                    return deserializeDto(obj);

                default:
                    return deserializeArray(obj);
            }

        case typeof obj === 'object':
            return deserializeObject(obj);

        default:
            return obj;
    }
}
