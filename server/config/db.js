const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/flyertech-blog';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);

    // Automatically seed initial data if needed
    const seeder = require('../seeder');
    await seeder.seedAll();

    return conn;
  } catch (err) {
    isConnected = false;
    console.log(`[MongoDB] Connection notice: Could not connect to MongoDB at ${uri} (${err.message}).`);
    console.log('[MongoDB] NOTE: The server will continue running. You can configure your local MongoDB or set MONGODB_URI (e.g. MongoDB Atlas) in server/.env anytime.');
    return null;
  }
};

const getStatus = () => ({
  connected: isConnected,
  database: isConnected ? mongoose.connection.name : 'offline',
});

module.exports = { connectDB, getStatus };
