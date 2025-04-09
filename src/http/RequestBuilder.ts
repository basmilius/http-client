import { DateTime } from 'luxon';
import { HttpAdapter } from '@/adapter';
import { BlobResponse, Paginated, RequestError } from '@/dto';
import type { HttpMethod, HttpStatusCode } from '@/type';
import BaseResponse from './BaseResponse';
import HttpClient from './HttpClient';
import type QueryString from './QueryString';

export default class RequestBuilder {
    get client(): HttpClient {
        return this.#client;
    }

    get options(): RequestInit {
        return this.#options;
    }

    get path(): string {
        return this.#path;
    }

    set path(value: string) {
        this.#path = value;
    }

    get query(): QueryString | null {
        return this.#query;
    }

    set query(value: QueryString | null) {
        this.#query = value;
    }

    readonly #client: HttpClient;
    #path: string;
    #options: RequestInit = {};
    #query: QueryString | null = null;

    constructor(path: string, client?: HttpClient) {
        this.#client = client ?? HttpClient.instance;
        this.#options.cache = 'no-cache';
        this.#options.method = 'GET';
        this.#path = path;
    }

    public bearerToken(token?: string): RequestBuilder {
        token = token ?? this.#client.authToken;

        if (token) {
            return this.header('Authorization', `Bearer ${token}`);
        }

        if (this.#options.headers && 'Authorization' in this.#options.headers) {
            delete this.#options.headers['Authorization'];
        }

        return this;
    }

    public body(body: BodyInit | FormData | object | null, contentType: string | null = 'application/octet-stream'): RequestBuilder {
        if (body instanceof FormData) {
            // note: this allows browsers to set formdata with their custom boundary.
            contentType = null;
        } else if (Array.isArray(body) || typeof body === 'object') {
            body = JSON.stringify(body);
            contentType = 'application/json';
        }

        this.#options.body = body;

        if (contentType !== null) {
            return this.header('Content-Type', contentType);
        }

        return this;
    }

    public header(name: string, value: string): RequestBuilder {
        this.#options.headers = this.#options.headers || {};
        this.#options.headers[name] = value;

        return this;
    }

    public method(method: HttpMethod): RequestBuilder {
        this.#options.method = method.toUpperCase();

        return this;
    }

    public queryString(queryString: QueryString): RequestBuilder {
        this.#query = queryString;

        return this;
    }

    public signal(signal: AbortSignal | null = null): RequestBuilder {
        this.#options.signal = signal;

        return this;
    }

    public async fetch<TResult>(): Promise<TResult> {
        return this.#execute()
            .then(r => r.json());
    }

    public async fetchBlob(): Promise<BlobResponse> {
        let response = await this.#execute();

        if (response.status !== 200) {
            const data = await response.json();

            if ('code' in data && 'error' in data && 'error_description' in data) {
                throw new RequestError(data.code, data.error, data.error_description, response.status as HttpStatusCode);
            }

            throw new RequestError(-1, 'failed_without_info', 'Request failed without any information from the backend.', response.status as HttpStatusCode);
        }

        let filename = response.headers.has('content-disposition')
            ? HttpAdapter.parseFileNameFromContentDispositionHeader(response.headers.get('content-disposition'))
            : `download-${DateTime.now().toFormat('yyyy-MM-dd HH-mm-ss')}`;

        return new BlobResponse(
            await response.blob(),
            filename
        );
    }

    public async run<TResult extends {}>(): Promise<BaseResponse<TResult>> {
        const {data, response} = await this.#executeSafe<TResult>();

        return new BaseResponse(data, response);
    }

    public async runAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<TResult>> {
        const {data, response} = await this.#executeSafe<TResult>();

        return new BaseResponse(adapterMethod(data), response);
    }

    public async runArrayAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<TResult[]>> {
        return this.runAdapter<TResult[]>((data: []) => data.map(adapterMethod));
    }

    public async runEmpty(): Promise<BaseResponse<never>> {
        return await this.#executeSafe<never>();
    }

    public async runPaginatedAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<Paginated<TResult>>> {
        return this.runAdapter<Paginated<TResult>>(response => HttpAdapter.parsePaginatedAdapter(response, adapterMethod));
    }

    public async runData<TResult>(): Promise<BaseResponse<TResult>> {
        return await this.#executeSafe<TResult>();
    }

    public async runDataKey<TResult extends object, TKey extends keyof TResult = keyof TResult>(key: TKey): Promise<BaseResponse<TResult[TKey]>> {
        const {data, response} = await this.#executeSafe<TResult>();

        return new BaseResponse(data[key] as TResult[TKey], response);
    }

    public async runStatusCode(): Promise<HttpStatusCode> {
        const response = await this.#executeSafe<never>();

        return response.statusCode;
    }

    async #execute(): Promise<Response> {
        let path = this.path;

        if (this.query !== null) {
            path += `?${this.query.build()}`;
        }

        return await fetch(this.client.baseUrl + path, this.options);
    }

    async #executeSafe<TResult>(): Promise<BaseResponse<TResult>> {
        return await this
            .#execute()
            .then(response => RequestBuilder.#handleResponse<TResult>(response, this.client.dataField));
    }

    static async #handleResponse<TResult>(response: Response, dataField: boolean): Promise<BaseResponse<TResult | null>> {
        if (response.status === 204) {
            return new BaseResponse(null, response);
        }

        if (response.headers.has('content-type') && response.headers.get('content-type').startsWith('application/json')) {
            const data = await response.json();

            if ('code' in data && 'error' in data && 'error_description' in data) {
                if ('errors' in data) {
                    throw HttpAdapter.parseValidationError(data);
                }

                throw HttpAdapter.parseRequestError(data, response.status as HttpStatusCode);
            }

            if (dataField && 'data' in data) {
                return new BaseResponse(data.data as TResult, response);
            }

            return new BaseResponse(data, response);
        }

        if (response.status === 401 || response.status === 403) {
            return new BaseResponse(null, response);
        }

        const data = await response.text();

        if (data.length === 0 && response.status >= 200 && response.status < 300) {
            return new BaseResponse(null, response);
        }

        throw new RequestError(-1, 'not_a_json_response', 'The response was not a JSON response.', response.status as HttpStatusCode);
    }
}
