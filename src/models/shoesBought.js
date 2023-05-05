const mongoose = require('mongoose');
const { Schema } = mongoose;
const shoesBought = new Schema(
    {
        userID: { type: String, required: true },
        size: Number,
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 50 },
        imageShoes: { type: String, require: true },
        listColor: Object,
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('historyPurchase', shoesBought);
