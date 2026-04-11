export function role(roles) {
    return (req, res, next) => {
        if (!req.principal) {
            return res.status(401).json({
                data: null,
                status: 'Error',
                error: 'You must be authenticated to access this resource. Please create an account or login (and also, ensure that you add the access token in the Authorization header).'
            });
        }

        if (roles.includes(req.principal.role)) {
            console.log('Access granted');
            return next()
        } else {
            console.log('Access denied');
            res.status(403)
                .json({
                    data: null,
                    status: 'Error',
                    error: 'Access denied: You are not authorized to access this resource.'
                });
        }
    }
}