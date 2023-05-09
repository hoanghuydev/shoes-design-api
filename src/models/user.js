const mongoose = require('mongoose');
const { Schema } = mongoose;
const user = new Schema(
    {
        email: { type: String, required: true },
        password: { type: String, minLength: 6 },
        name: String,
        age: { type: Number, default: 18 },
        address: { type: String, default: '' },
        avatarUrl: {
            type: String,
            default:
                'https://top10dienbien.com/wp-content/uploads/2022/10/avatar-cute-11.jpg',
        },
    },
    { collection: 'user', timestamps: true }
);
module.exports = mongoose.model('user', user);
