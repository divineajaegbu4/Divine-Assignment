export class UserNotFoundException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }

    get code() {
        return this.statusCode;
    }
}