
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connStr = process.env.MONGO_URI || 'mongodb+srv://linas:123@cluster0.gumob.mongodb.net/tov?retryWrites=true&w=majority';
        await mongoose.connect(connStr);
        console.log('DB connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}
module.exports = connectDB;