export type SerializedDateTime = [0xBF2, string];
export type SerializedDto = [0xBF1, string, string, Record<string, unknown>, any[]];
export type Serialized = boolean | number | string | Record<string, unknown> | SerializedDateTime | SerializedDto | Serialized[];
