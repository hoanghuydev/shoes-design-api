const mongoose = require('mongoose');
const { Schema } = mongoose;
var mongoose_delete = require('mongoose-delete');
const shoes = new Schema(
    {
        userID: { type: String, required: true },
        size: Number,
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 50 },
        imageShoes: { type: String, require: true },
        listColor: Object,
    },
    {
        collection: 'cart',
        timestamps: true,
    }
);
shoes.plugin(mongoose_delete);
module.exports = mongoose.model('cart', shoes);
