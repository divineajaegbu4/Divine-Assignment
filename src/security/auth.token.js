import jwt from "jsonwebtoken";

export class AuthToken {
    static sign(payload) {
        console.log("Secret_key", process.env.JWT_SECRET);
        return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '15m'});

    }

    static verify(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}