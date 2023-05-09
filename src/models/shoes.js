const mongoose = require('mongoose');
const { Schema } = mongoose;
const shoes = new Schema(
    {
        userID: { type: Schema.Types.ObjectId, required: true },
        size: Number,
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 50 },
        imageShoes: { type: String, require: true },
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model('carts', shoes);
