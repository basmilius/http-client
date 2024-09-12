import RequestError from './RequestError';

export function isRequestError(obj: unknown): obj is RequestError {
    return obj instanceof RequestError;
}

export function isUnsanctionedRequest(statusCode: unknown): boolean {
    if (statusCode instanceof RequestError) {
        statusCode = statusCode.statusCode;
    }

    return statusCode === 403 || statusCode === 401;
}
