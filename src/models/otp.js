const mongoose = require('mongoose');
const { Schema } = mongoose;
const otp = new Schema(
    {
        email: String,
        otp: String,
        expireAt: { type: Date, default: Date.now, index: { expires: 60 } },
    },
    {
        collection: 'otp',
    }
);
module.exports = mongoose.model('otp', otp);
