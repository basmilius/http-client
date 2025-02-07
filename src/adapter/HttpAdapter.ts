import { DateTime } from 'luxon';
import { adapter } from '@/decorator';
import { Paginated } from '@/dto';

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
}
