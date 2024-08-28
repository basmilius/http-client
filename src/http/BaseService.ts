import { HttpClient, RequestBuilder } from '.';

export class BaseService {
    protected request(path: string, client?: HttpClient): RequestBuilder {
        return new RequestBuilder(path, client);
    }
}
