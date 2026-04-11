import {AuthToken} from "../security/auth.token.js";

export default function TokenDecoder() {
    return (req, res, next) => {
        const bearerToken = req.headers.authorization;

        if (!bearerToken) {
            return res.status(401).json({
                data: null,
                status: 'Error',
                error: 'You must be authenticated to access this resource. Please create an account or login (and also, ensure that you add the access token in the Authorization header).'
            });
        }

        const [, token] = bearerToken.split(' ');

        if (!token) {
            return res.status(401).json({
                data: null,
                status: 'Error',
                error: 'You must be authenticated to access this resource. Please create an account or login (and also, ensure that you add the access token in the Authorization header).'
            });
        }

        req.principal = AuthToken.verify(token);

        next();
    }
}