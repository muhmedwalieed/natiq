import app from '../src/app.js';
import mongoose from 'mongoose';
import config from '../src/config/index.js';

let isConnected = false;

const connectDBForServerless = async () => {
  if (isConnected) {
    return;
  }
  try {
    const conn = await mongoose.connect(config.mongo.uri);
    isConnected = conn.connections[0].readyState === 1;
    console.log(`Serverless: MongoDB connected to ${conn.connection.host}`);
  } catch (error) {
    console.error(`Serverless: MongoDB connection error: ${error.message}`);
  }
};

export default async function handler(req, res) {
  await connectDBForServerless();
  return app(req, res);
}
