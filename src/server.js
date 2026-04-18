import http from 'http';
import app from './app.js';
import config from './config/index.js';
import connectDB from './config/db.js';
import { initializeSocket } from './sockets/index.js';

const startServer = async () => {

    await connectDB();

  const server = http.createServer(app);

  initializeSocket(server);

  server.listen(config.port, () => {
    console.log(`✅ Server running on http://localhost:${config.port}`);
    console.log(`📡 API: http://localhost:${config.port}/api/v1`);
    console.log(`🔌 Socket: ws://localhost:${config.port}`);
  });

  const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
