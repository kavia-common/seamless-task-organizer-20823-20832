const app = require('./app');
const { runMigrations } = require('./db/migrate');

// Use 3001 by default to match orchestrator expectation
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

let server;

/**
 * Kick off background migrations with retries so we don't block the HTTP port.
 * This ensures the service can bind and liveness checks can pass while DB is coming up.
 */
async function runMigrationsWithRetry({
  attempts = 10,
  delayMs = 3000,
} = {}) {
  for (let i = 1; i <= attempts; i++) {
    try {
      await runMigrations();
      console.log('[startup] Database migrations completed');
      return;
    } catch (err) {
      const message = err?.message || String(err);
      // Provide actionable hints if env vars are missing
      const missingEnv =
        message.includes('Missing required database environment variables') ||
        message.includes('MYSQL_');

      console.error(
        `[startup] Migration attempt ${i}/${attempts} failed: ${message}`
      );
      if (missingEnv) {
        console.error(
          '[startup] It looks like required env vars are missing. Ensure MYSQL_URL, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB (optional: MYSQL_PORT, MYSQL_CONNECTION_LIMIT) are set in to_do_backend .env'
        );
        // No point retrying if env is missing; wait once to allow logs to flush and return.
        return;
      }

      if (i < attempts) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }
  console.error(
    '[startup] Migrations did not complete after all retry attempts. The service is up, but DB may not be ready. Check /api/tasks/_ready for DB readiness.'
  );
}

function start() {
  // Start the HTTP server immediately to satisfy port readiness.
  server = app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });

  // Begin migrations in the background (non-blocking).
  runMigrationsWithRetry().catch((err) => {
    console.error(
      '[startup] Unexpected error while running background migrations:',
      err?.message || err
    );
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

start();

module.exports = server;
