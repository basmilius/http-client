import { DateTime } from 'luxon';
import { adapter } from '@/decorator';
import { Paginated, RequestError, ValidationError } from '@/dto';
import type { HttpStatusCode } from '@/type';

@adapter
export class HttpAdapter {
    public static parsePaginatedAdapter<T>(response: object, adapterMethod: (item: object) => T): Paginated<T> {
        return new Paginated<T>(
            response['items'].map(adapterMethod),
            response['page'],
            response['page_size'],
            response['pages'],
            response['total_items']
        );
    }

    public static parseFileNameFromContentDispositionHeader(header: string): string {
        const defaultFilename = `download-${DateTime.now().toFormat('yyyy-MM-dd HH-mm-ss')}`;

        if (!header.startsWith('attachment')) {
            return defaultFilename;
        }

        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);

        if ((matches?.length || 0) < 2) {
            return defaultFilename;
        }

        return matches[1]
            .replaceAll('\'', '')
            .replaceAll('\"', '')
            .replaceAll('\/', '-')
            .replaceAll('\:', '-');
    }

    public static parseRequestError(response: object, statusCode: HttpStatusCode): RequestError {
        return new RequestError(
            response['code'],
            response['error'],
            response['error_description'],
            statusCode
        );
    }

    public static parseValidationError(response: object): ValidationError {
        let errors: Record<string, ValidationError>;

        if (response['errors']) {
            errors = {};

            Object.entries(response['errors']).forEach(([key, value]) => {
                errors[key] = HttpAdapter.parseValidationError(value as object);
            });
        }

        return new ValidationError(
            response['code'],
            response['error'],
            response['error_description'],
            errors,
            response['params']
        );
    }
}
