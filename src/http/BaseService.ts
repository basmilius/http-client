import HttpClient from './HttpClient';
import RequestBuilder from './RequestBuilder';

export default class BaseService {
    protected request(path: string, client?: HttpClient): RequestBuilder {
        return new RequestBuilder(path, client);
    }
}
