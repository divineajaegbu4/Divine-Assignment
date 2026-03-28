import bcrypt from 'bcrypt';

export class Password {
    hash(password) {
        return bcrypt.hash(password, 10);
    }

    verify(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}