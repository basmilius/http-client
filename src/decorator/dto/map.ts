import type { Constructor } from '@/util';
import type DtoInstance from './instance';

export const DTO_CLASS_MAP: Record<string, Constructor<DtoInstance<unknown>>> = {};
