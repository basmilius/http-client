import { HttpAdapter } from '@/adapter';
import { BlobResponse, Paginated } from '@/dto';
import { HttpMethod, HttpStatusCode } from '@/enum';
import { formatFileDateTime } from '@/util';
import { BaseResponse, HttpClient, type IResponseErrors, QueryString, RequestError } from '.';

export class RequestBuilder {
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
        this.#options.method = HttpMethod.Get;
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

    public asOrganization(value: string): RequestBuilder {
        return this.header('X-Organization-Id', value);
    }

    public header(name: string, value: string): RequestBuilder {
        this.#options.headers = this.#options.headers || {};
        this.#options.headers[name] = value;

        return this;
    }

    public method(method: HttpMethod): RequestBuilder {
        this.#options.method = method;

        return this;
    }

    public queryString(queryString: QueryString): RequestBuilder {
        this.#query = queryString;

        return this;
    }

    public async fetch<TResult>(): Promise<TResult> {
        return this.#execute()
            .then(r => r.json());
    }

    public async fetchBlob(): Promise<BlobResponse> {
        let response = await this.#execute();

        if (response.status !== HttpStatusCode.Ok) {
            const {errors} = await response.json();
            const responseErrors = errors as IResponseErrors;
            throw new RequestError('Request failed.', responseErrors, response.status);
        }

        let filename = response.headers.has('content-disposition')
            ? HttpAdapter.parseFileNameFromContentDispositionHeader(response.headers.get('content-disposition'))
            : `download-${formatFileDateTime()}`;

        return new BlobResponse(
            await response.blob(),
            filename
        );
    }

    public async runAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<TResult>> {
        const {data, response} = await this.#executeSafe<TResult>();

        return new BaseResponse(adapterMethod(data), null, response);
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

        return new BaseResponse(data[key] as TResult[TKey], null, response);
    }

    public async runStatusCode(): Promise<HttpStatusCode> {
        const response = await this.#executeSafe<never>();

        return response.statusCode;
    }

    async #execute(): Promise<Response> {
        const request = this.#client.onRequest(this);

        let path = request.path;

        if (request.query !== null) {
            path += `?${request.query.build()}`;
        }

        return await fetch(request.client.baseUrl + path, request.options)
            .catch(err => {
                this.#client.onException(err, request);
                throw err;
            });
    }

    async #executeSafe<TResult>(): Promise<BaseResponse<TResult>> {
        const response = await this
            .#execute()
            .then(RequestBuilder.#handleResponse<TResult>)
            .then(response => {
                this.#client.onResponse(response);
                return response;
            });

        const {errors, statusCode} = response;

        if (statusCode < HttpStatusCode.Ok || statusCode >= HttpStatusCode.MultipleChoices) {
            if (!!errors) {
                throw new RequestError('Request failed with errors.', errors, statusCode);
            }

            throw new RequestError('Request failed without errors.', {}, statusCode);
        }

        return response;
    }

    static async #handleResponse<TResult>(response: Response): Promise<BaseResponse<TResult | null>> {
        if (response.status === HttpStatusCode.NoContent) {
            return new BaseResponse(null, null, response);
        }

        if (response.headers.has('content-type') && response.headers.get('content-type').startsWith('application/json')) {
            const {data, errors} = await response.json();

            return new BaseResponse(data, errors, response);
        }

        if (response.status === HttpStatusCode.Unauthorized || response.status === HttpStatusCode.Forbidden) {
            return new BaseResponse(null, null, response);
        }

        const data = await response.text();

        if (data.length === 0 && response.status >= HttpStatusCode.Ok && response.status < HttpStatusCode.MultipleChoices) {
            return new BaseResponse(null, null, response);
        }

        throw new RequestError('Response was not a JSON response.', {}, response.status);
    }
}
