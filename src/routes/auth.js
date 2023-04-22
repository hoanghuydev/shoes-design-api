const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const vetifyToken = require('../middleware/vetifyToken');
router.post('/register/otp', authController.sendOTP);
router.post('/register', authController.vetifyOTPAndCreateUser);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshTokenKey);
router.patch('/:id/password/forgot', authController.forgotPassword);
router.patch(
    '/:id/password/edit',
    vetifyToken.origin,
    authController.editPassword
);

module.exports = router;
