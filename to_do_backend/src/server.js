const app = require('./app');
const { runMigrations } = require('./db/migrate');

// Use 3001 by default to match orchestrator expectation
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

let server;

async function start() {
  try {
    // Start the HTTP server first so the port is ready for health checks.
    server = app.listen(PORT, HOST, () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    });

    // Kick off migrations in the background. If DB is not yet ready, log and continue.
    runMigrations()
      .then(() => console.log('Database migrations completed'))
      .catch((err) => {
        console.error('Database migration failed (continuing to serve):', err?.message || err);
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
