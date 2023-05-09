const User = require('../models/user');
const Shoes = require('../models/shoes');
const HistoryPurchase = require('../models/shoesBought');
const { response } = require('express');
class UserController {
    async getCart(req, res, next) {
        const shoesList = await Shoes.find({ userID: req.params.userID });
        const total = shoesList.reduce((previousValue, currentValue) => {
            const itemPrice = currentValue.price || 0;
            const itemQuantity = currentValue.quantity || 0;
            return previousValue + itemPrice * itemQuantity;
        }, 0);
        return res.status(200).json({
            shoesList,
            total,
        });
    }
    async setCart(req, res, next) {
        const newShoes = await new Shoes({
            userID: req.params.userID,
            size: req.body.size,
            quantity: req.body.quantity,
            imageShoes: req.body.imageShoes,
        });
        newShoes.save().then((shoes) => res.status(200).json(shoes));
    }
    async cartHistory(req, res) {
        HistoryPurchase.find({ userID: req.params.userID }).then((shoesList) =>
            res.status(200).json(shoesList)
        );
    }

    async removeItems(req, res) {
        Shoes.deleteMany({ _id: { $in: req.body.idItems } }).then((shoes) =>
            res.status(200).json(shoes)
        );
    }

    async buyItems(req, res) {
        try {
            console.log(req.body.idItems);
            const buyItems = await Shoes.find({
                _id: { $in: req.body.idItems },
            }).lean();
            const result = await Shoes.deleteMany({
                _id: { $in: req.body.idItems },
            });
            console.log(result);
            const itemsWithoutId = buyItems.map((item) => {
                const { _id, updatedAt, createdAt, ...rest } = item;
                return rest;
            });
            await HistoryPurchase.create(itemsWithoutId).then((result) =>
                res.status(200).json(result)
            );
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error processing purchase.' });
        }
    }
    async repurchaseItem(req, res) {
        HistoryPurchase.findById(req.params.id)
            .lean()
            .then((shoes) => {
                const { _id, updatedAt, createdAt, quantity, ...rest } = shoes;
                const newQuantity = req.body.quantity;
                HistoryPurchase.create({ newQuantity, ...rest }).then(
                    (shoesList) => res.status(200).json(shoesList)
                );
            });
    }
    async infoUser(req, res, next) {
        User.find({ _id: req.params.userID })
            .then((user) => res.status(200).json(user))
            .catch((err) => next(err));
    }
}

module.exports = new UserController();
