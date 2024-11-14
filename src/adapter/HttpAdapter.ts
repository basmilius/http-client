import { adapter } from '@/decorator';
import { Paginated } from '@/dto';
import { formatFileDateTime } from '@/util';

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
        if (!header.startsWith('attachment')) {
            return `download-${formatFileDateTime()}`;
        }

        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);

        if ((matches?.length || 0) < 2) {
            return `download-${formatFileDateTime()}`;
        }

        return matches[1]
            .replaceAll('\'', '')
            .replaceAll('\"', '')
            .replaceAll('\/', '-')
            .replaceAll('\:', '-');
    }
}
