export class HttpResponse {
    constructor(responseBody, responseLabel = 'data', status = 'Success', error = null) {
        this[responseLabel] = responseBody;
        this.status = status;
        this.error = error;
    }
}