const express = require('express');
const router = express.Router();
const vetifyToken = require('../middleware/vetifyToken');
const userController = require('../controller/userController');
router.get('/:userID/cart', vetifyToken.forParam, userController.getCart);
router.post('/:userID/cart', vetifyToken.forParam, userController.setCart);
router.get(
    '/:userID/cart/purchase/history',
    vetifyToken.forParam,
    userController.cartHistory
);
router.delete(
    '/:userID/cart/remove',
    vetifyToken.forParam,
    userController.removeItems
);
router.post(
    '/:userID/cart/buy',
    vetifyToken.forBuyItem,
    userController.buyItems
);
router.post(
    '/:userID/cart/:id/repurchase',
    vetifyToken.forParam,
    userController.repurchaseItem
);
router.get('/profile/:userID', vetifyToken.forParam, userController.infoUser);

module.exports = router;
