const express = require('express');
const authRouter = require('./auth');
const userRouter = require('./user');

function route(app) {
    app.use('/v1/auth', authRouter);
    app.use('/user', userRouter);
    app.use('/test', res.json('Test ok'));
}
module.exports = route;
