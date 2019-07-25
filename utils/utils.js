const jwt = require('jsonwebtoken');

module.exports = {
    validateToken: (req, res, next) => {

        const authorizationHeaader = req.headers.authorization;
        let result;
        if (authorizationHeaader) {
            const token = authorizationHeaader;
            const options = {
                expiresIn: '24h'
            };
            try {
                // verify makes sure that the token hasn't expired and has been issued by us
                result = jwt.verify(token, process.env.SECRET_KEY, options);
                // Let's pass back the decoded token to the request object
                req.decoded = result;
                // We call next to pass execution to the subsequent middleware
                next();
            } catch (err) {
                return res.status(401).send({
                    message: 'Session expired. Please login again!'
                });
            }
        } else {
            return res.status(401).send({
                message: 'Session expired. Please login again!'
            });
        }
    }
};