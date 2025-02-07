import type { Constructor } from '@basmilius/utils';
import type DtoInstance from './instance';

export const DTO_CLASS_MAP: Record<string, Constructor<DtoInstance<unknown>>> = {};
