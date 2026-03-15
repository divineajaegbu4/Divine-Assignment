export class ServerException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 500;
    }

    get code() {
        return this.statusCode;
    }
}