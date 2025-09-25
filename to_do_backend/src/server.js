const app = require('./app');
const { runMigrations } = require('./db/migrate');

// Use 3001 by default to match orchestrator expectation
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

let server;

async function start() {
  try {
    // Run migrations BEFORE starting the server to ensure DB schema exists.
    await runMigrations();
    console.log('Database migrations completed');

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
    // Fail fast if we cannot prepare the database; this prevents serving broken API.
    console.error('Failed to start server (DB not ready or migration failed):', err?.message || err);
    process.exit(1);
  }
}

start();

module.exports = server;
