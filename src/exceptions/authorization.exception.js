export class AuthorizationException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 403;
    }

    get code() {
        return this.statusCode;
    }
}
