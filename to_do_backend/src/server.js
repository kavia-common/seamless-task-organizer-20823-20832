const app = require('./app');
const { runMigrations } = require('./db/migrate');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

let server;

async function start() {
  try {
    await runMigrations();
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err?.message || err);
    process.exit(1);
  }
}

start();

module.exports = server;
