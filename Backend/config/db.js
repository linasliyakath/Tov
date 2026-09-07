
const mongoose = require('mongoose');

let connectionPromise;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        const connStr = process.env.MONGO_URI;
        if (!connStr) {
            throw new Error('MONGO_URI is not configured');
        }

        connectionPromise = mongoose.connect(connStr)
            .then(() => {
                console.log('DB connected successfully');
                return mongoose.connection;
            })
            .catch((error) => {
                connectionPromise = undefined;
                throw error;
            });
    }

    return connectionPromise;
}
module.exports = connectDB;
