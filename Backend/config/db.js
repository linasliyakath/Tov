
const mongoose = require('mongoose')

const connectDB = async () =>{
    try {
        await mongoose.connect('mongodb+srv://linas:123@cluster1.sa4jwmi.mongodb.net/')
        console.log('DB connected');
    } catch (error) {
        console.log(error);
    }
}
module.exports = connectDB