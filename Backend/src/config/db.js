const mongoose = require('mongoose');
const env = require('@/config/env');
const URI = env.MONGODB_URI;

const connectDatabase = async() =>{
    try {
        await mongoose.connect(URI);
        console.log('Database is connect');
    } catch (error) {
        console.log("Database is not Connected");;
    }
}

module.exports = connectDatabase;

