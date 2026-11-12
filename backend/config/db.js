const mongoose = require('mongoose');

let connectionPromise;

const connectDB = () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return Promise.reject(new Error('MONGODB_URI is missing from environment variables.'));
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri)
      .then((conn) => {
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;
