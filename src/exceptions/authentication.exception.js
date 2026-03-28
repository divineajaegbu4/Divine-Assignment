export class AuthenticationException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }

    get code() {
        return this.statusCode;
    }
}
