const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const vetifyToken = require('../middleware/vetifyToken');
router.post('/register/otp', authController.sendOTP);
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshTokenKey);
router.patch('/:id/password/forgot', authController.forgotPassword);
router.patch(
    '/:id/password/edit',
    vetifyToken.origin,
    authController.editPassword
);
router.delete('/:id/remove', authController.removeUser);

module.exports = router;
