const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
class verifyToken {
    origin(req, res, next) {
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json('You are not authenticated');
        }
        const accessToken = token.split(' ')[1];
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err, user) => {
            if (err) {
                return res.status(403).json('Token is not valid');
            }
            req.user = user;
            next();
        });
    }
    forCart(req, res, next) {
        new verifyToken().origin(req, res, () => {
            if (!(req.user.id === req.body.userID)) {
                return res.status(403).json('You are not allowed to access');
            }
            next();
        });
    }
    forParam(req, res, next) {
        new verifyToken().origin(req, res, () => {
            if (!(req.user.id === req.params.userID)) {
                return res.status(403).json('You are not allowed to access');
            }
            next();
        });
    }
    forBuyItem(req, res, next) {
        new verifyToken().origin(req, res, () => {
            if (!(req.user.id === req.params.userID)) {
                return res.status(403).json('You are not allowed to access');
            }
            if (req.user.address === '') {
                return res.status(403).json('You not have address yet');
            }
            next();
        });
    }
}
module.exports = new verifyToken();
