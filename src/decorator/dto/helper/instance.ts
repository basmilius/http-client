import type DtoInstance from '../instance';

export default function <T>(dto: DtoInstance<T>): DtoInstance<T> {
    return (dto as any)?.value ?? dto;
}
