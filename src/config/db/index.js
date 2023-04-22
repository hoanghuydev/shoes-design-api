const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connnet successfully');
    } catch (error) {
        console.log('Failed to connect');
    }
}
module.exports = { connect };
