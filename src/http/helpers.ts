import { HttpStatusCode } from '@/enum';
import { RequestError } from '@/http';

export function isRequestError(obj: unknown): obj is RequestError {
    return obj instanceof RequestError;
}

export function isUnsanctionedRequest(statusCode: unknown): boolean {
    if (statusCode instanceof RequestError) {
        statusCode = statusCode.statusCode;
    }

    return statusCode === HttpStatusCode.Forbidden || statusCode === HttpStatusCode.Unauthorized;
}
