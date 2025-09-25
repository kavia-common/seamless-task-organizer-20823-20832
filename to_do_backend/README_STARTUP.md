# Backend startup and DB readiness

This backend now starts the HTTP server immediately on port 3001 and runs database migrations in the background with retries. This ensures the container becomes ready for port checks even if the database is not yet available.

What to expect:
- The service binds to http://0.0.0.0:3001 quickly.
- Background migration attempts will run up to 10 times, waiting 3 seconds between attempts.
- If required environment variables are missing, migrations will log a clear message and stop retrying.
- Check GET /api/tasks/_ready to verify DB readiness.

Required environment variables for database connectivity:
- MYSQL_URL
- MYSQL_USER
- MYSQL_PASSWORD
- MYSQL_DB
- Optional: MYSQL_PORT (default 3306), MYSQL_CONNECTION_LIMIT (default 10)

If the service is up but DB is not ready:
- Verify the to_do_database container is running and accepts connections.
- Ensure the above env vars are set in the to_do_backend .env.
- After DB becomes reachable, background migrations will complete automatically. You can also hit /api/tasks/_ready to confirm.

Notes:
- Routes that require the DB will still return errors until the database is ready/migrations complete.
- Health endpoint / returns general service health independent of DB.
