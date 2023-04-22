const User = require('../models/user');
const Shoes = require('../models/shoes');
class UserController {
    async getCart(req, res, next) {
        const shoesList = await Shoes.find({ userID: req.body.userID });
        return res.status(200).json({
            shoesList,
            total: shoesList.reduce(
                (previousValue, currentValue) => previousValue + currentValue
            ),
        });
    }
    async setCart(req, res, next) {
        const newShoes = await new Shoes({
            userID: req.body.userID,
            size: req.body.size,
            quantity: req.body.quantity,
            imageShoes: req.body.imageShoes,
        });
        newShoes.save().then((shoes) => res.status(200).json(shoes));
    }
    async cartHistory(req, res) {
        Shoes.findDelete({ userID: req.body.userID }).then((shoes) =>
            res.status(200).json(shoes)
        );
    }

    async removeItems(req, res) {
        Shoes.deleteMany({ _id: { $in: req.params.idItems } }).then((shoes) =>
            res.status(200).json(shoes)
        );
    }

    async buyItems(req, res) {
        Shoes.delete({ _id: { $in: req.params.idItems } }).then((shoes) =>
            res.status(200).json(shoes)
        );
    }
    async repurchaseItem(req, res) {
        Shoes.restore({ _id: req.params.idItem }).then((shoes) =>
            res.status(200).json(shoes)
        );
    }
    async infoUser(req, res, next) {
        User.find({ _id: req.params.userID })
            .then((user) => res.status(200).json(user))
            .catch((err) => next(err));
    }
}

module.exports = new UserController();
