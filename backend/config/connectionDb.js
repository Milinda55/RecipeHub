const mongoose = require('mongoose');

const connectDb = async () => {
    // await mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MongoDB Connected'));
    try {
        await mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MongoDB Connected'));
    } catch (error) {
        console.error("MongoDB connection failed", error.message);
        process.exit(1);
    }
}

module.exports = connectDb;