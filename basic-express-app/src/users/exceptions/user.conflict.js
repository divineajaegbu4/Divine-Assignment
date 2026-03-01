export class UserConflictException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 409;
    }

    get code() {
        return this.statusCode;
    }
}