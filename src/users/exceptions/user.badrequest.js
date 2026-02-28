export class UserBadRequestException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }

    get code() {
        return this.statusCode;
    }
}
