'use strict';
/**
 * Database configuration and connection pool for MySQL using mysql2/promise.
 * Uses environment variables provided by the to_do_database container.
 * Required env vars:
 * - MYSQL_URL, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_PORT
 */

const mysql = require('mysql2/promise');

// PUBLIC_INTERFACE
async function createPool() {
  /**
   * Create and return a MySQL connection pool using environment variables.
   * This function is idempotent; it returns an existing pool if already created.
   */
  if (global.__mysql_pool) {
    return global.__mysql_pool;
  }

  const {
    MYSQL_URL,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB,
    MYSQL_PORT,
    MYSQL_CONNECTION_LIMIT,
  } = process.env;

  if (!MYSQL_URL || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DB) {
    // Provide a clear error to orchestrator to supply env vars
    throw new Error(
      'Missing required database environment variables. Please ensure MYSQL_URL, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB (and optional MYSQL_PORT, MYSQL_CONNECTION_LIMIT) are set in the .env for to_do_backend.'
    );
  }

  const pool = mysql.createPool({
    host: MYSQL_URL,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: MYSQL_CONNECTION_LIMIT ? Number(MYSQL_CONNECTION_LIMIT) : 10,
    queueLimit: 0,
    namedPlaceholders: true,
  });

  // Quick validation the DB is reachable
  await pool.query('SELECT 1');

  global.__mysql_pool = pool;
  return pool;
}

// PUBLIC_INTERFACE
async function getPool() {
  /** Get the global pool, creating it if necessary. */
  return createPool();
}

module.exports = {
  createPool,
  getPool,
};
