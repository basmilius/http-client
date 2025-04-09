import { RequestError, ValidationError } from '@/dto';

export function isRequestError(obj: unknown): obj is RequestError {
    return obj instanceof RequestError;
}

export function isUnsanctionedRequest(statusCode: unknown): boolean {
    if (statusCode instanceof RequestError) {
        statusCode = statusCode.statusCode;
    }

    return statusCode === 403 || statusCode === 401;
}

export function isValidationError(obj: unknown): obj is ValidationError {
    return obj instanceof ValidationError;
}
