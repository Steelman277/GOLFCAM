import mongoose from 'mongoose';


// MongoDB connection URI string for the database connection - default to localhost
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
// Debug mode - default to false - true to enable consol logging
const DEBUG = process.env.DEBUG || "false";

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

const connectDB = async () => {
    try
    {
        const conn = await mongoose.connect(MONGODB_URI);
        if (DEBUG === "true") console.log('Connected to MongoDB:', conn.connection.host);
        return conn;
    }
    catch (err)
    {
        if (DEBUG === "true") console.log('Error connecting to MongoDB:', err);
        throw err;
    }
}

export default connectDB;