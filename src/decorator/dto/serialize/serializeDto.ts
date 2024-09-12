import { toRaw } from 'vue';
import { ARGS, NAME } from '../symbols';
import type { SerializedDto } from './types';
import type DtoInstance from '../instance';
import serializeArray from './serializeArray';
import serializeObject from './serializeObject';
import uuid from './uuid';

export default function (obj: DtoInstance<unknown>): SerializedDto {
    obj = toRaw(obj);

    const json = obj.toJSON();

    return [
        0xBF1,
        uuid(),
        obj[NAME],
        serializeObject(json),
        serializeArray(obj[ARGS])
    ];
}
