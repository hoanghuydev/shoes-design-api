const express = require('express');
const router = express.Router();
const vetifyToken = require('../middleware/vetifyToken');
const userController = require('../controller/userController');
router.get('/cart', vetifyToken.forCart, userController.getCart);
router.post('/cart', vetifyToken.forCart, userController.setCart);
router.post(
    '/cart/purchase/history',
    vetifyToken.forCart,
    userController.cartHistory
);
router.delete('/cart/remove', vetifyToken.forCart, userController.removeItems);
router.post('/cart/buy', vetifyToken.forBuyItem, userController.buyItems);
router.post(
    '/cart/purchase/repurchase',
    vetifyToken.forCart,
    userController.repurchaseItem
);
router.get('/profile/:userID', vetifyToken.forParam, userController.infoUser);

module.exports = router;
